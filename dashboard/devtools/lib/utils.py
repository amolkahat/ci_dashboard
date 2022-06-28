import requests

import logging

log = logging.getLogger(__name__)


def _make_request(url):
    try:
        log.debug("Request: {}".format(url))
        data = requests.get(url)
        if requests.status_codes == 200:
            log.debug("Request succeed")
            return data.json()
        else:
            log.debug("Request failed")
            log.error(data.text)
            return data.text
    except requests.exceptions.HTTPError as err:
        log.exception(err)
