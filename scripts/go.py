import requests
import sys
import csv
import re
import random
import json
import logging
from typing import Optional, List, Dict
from urllib.parse import quote
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%H:%M:%S'
)
logger = logging.getLogger(__name__)

class ProxyManager:
    def __init__(self, max_retries: int = 3):
        self.max_retries = max_retries
        self._proxy_list: List[str] = []
    
    def get_free_proxies(self) -> List[str]:
        """Fetch a list of free proxies from geonode."""
        try:
            logger.info("Fetching fresh proxy list from geonode...")
            proxy_url = "https://proxylist.geonode.com/api/proxy-list?limit=100&page=1&sort_by=lastChecked&sort_type=desc&protocols=http%2Chttps"
            response = requests.get(proxy_url, timeout=5)
            data = response.json()
            proxies = []
            for proxy in data.get('data', []):
                if proxy.get('protocols', []) and proxy.get('ip') and proxy.get('port'):
                    protocol = proxy['protocols'][0].lower()
                    ip = proxy['ip']
                    port = proxy['port']
                    proxies.append(f"{protocol}://{ip}:{port}")
            logger.info(f"Found {len(proxies)} available proxies")
            return proxies
        except Exception as e:
            logger.error(f"Failed to fetch proxies: {str(e)}")
            return []

    def make_request(self, url: str, headers: Dict[str, str] = None) -> Optional[requests.Response]:
        """Make a request using proxies if direct request fails."""
        # Try direct request first
        try:
            logger.debug("Attempting direct request...")
            response = requests.get(url, headers=headers, timeout=5)
            if response.status_code == 200:
                logger.debug("Direct request successful")
                return response
        except Exception as e:
            logger.debug(f"Direct request failed: {str(e)}")

        # If direct request fails, try with proxies
        if not self._proxy_list:
            self._proxy_list = self.get_free_proxies()

        for attempt in range(self.max_retries):
            if not self._proxy_list:
                logger.warning("No more proxies available")
                break
                
            proxy = random.choice(self._proxy_list)
            self._proxy_list.remove(proxy)  # Don't reuse the same proxy
            
            try:
                logger.debug(f"Attempt {attempt + 1}/{self.max_retries} using proxy")
                proxy_dict = {'http': proxy, 'https': proxy}
                response = requests.get(url, headers=headers, proxies=proxy_dict, timeout=5)
                if response.status_code == 200:
                    logger.debug("Proxy request successful")
                    return response
            except Exception as e:
                logger.debug(f"Proxy request failed: {str(e)}")
                continue
        
        logger.warning("All request attempts failed")
        return None

def get_first_youtube_result(query: str, proxy_manager: Optional[ProxyManager] = None) -> Optional[str]:
    """Get the first YouTube video result for a query."""
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    encoded_query = quote(query)
    search_url = f"https://www.youtube.com/results?search_query={encoded_query}"
    
    try:
        logger.info(f"Searching for: {query}")
        if proxy_manager:
            response = proxy_manager.make_request(search_url, headers=headers)
        else:
            response = requests.get(search_url, headers=headers, timeout=5)
            
        if response and response.status_code == 200:
            # Find first video ID in the response
            video_ids = re.findall(r"watch\?v=(\S{11})", response.text)
            if video_ids:
                result = f"https://www.youtube.com/watch?v={video_ids[0]}"
                logger.info(f"Found result: {result}")
                return result
            else:
                logger.warning("No video IDs found in response")
        else:
            logger.warning("Failed to get valid response")
    except Exception as e:
        logger.error(f"Error processing query '{query}': {str(e)}")
    
    return None

def process_csv(input_file: str, output_file: str, use_proxy: bool = False) -> None:
    results = []
    proxy_manager = ProxyManager() if use_proxy else None
    
    # Read queries from input CSV
    try:
        with open(input_file, 'r', encoding='utf-8') as csvfile:
            reader = csv.reader(csvfile)
            queries = [row[0] for row in reader]  # Assume single column of queries
            logger.info(f"Loaded {len(queries)} queries from {input_file}")
    except Exception as e:
        logger.error(f"Failed to read input file: {str(e)}")
        return
    
    # Process each query
    total = len(queries)
    for idx, query in enumerate(queries, 1):
        logger.info(f"Processing query {idx}/{total}: {query}")
        youtube_link = get_first_youtube_result(query, proxy_manager)
        results.append([query, youtube_link or "No result found"])
    
    # Write results to output CSV
    try:
        with open(output_file, 'w', encoding='utf-8', newline='') as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(['Query', 'YouTube Link'])
            writer.writerows(results)
        logger.info(f"Results written to {output_file}")
    except Exception as e:
        logger.error(f"Failed to write output file: {str(e)}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        logger.error("Usage: python go.py input.csv output.csv")
        sys.exit(1)
    
    start_time = datetime.now()
    logger.info(f"Starting YouTube search process at {start_time.strftime('%H:%M:%S')}")
    
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    process_csv(input_file, output_file, use_proxy=True)  # Set use_proxy=True to enable proxy support
    
    end_time = datetime.now()
    duration = end_time - start_time
    logger.info(f"Process completed in {duration.total_seconds():.2f} seconds")