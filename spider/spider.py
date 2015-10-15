import time
import urllib2

def get(protocol, pip, url): 
  try:
    proxy_handler = urllib2.ProxyHandler({protocol:pip})
    opener = urllib2.build_opener(proxy_handler)
    #opener.addheaders = [('User-agent', user_agent)] 
    urllib2.install_opener(opener)
 
    req = urllib2.Request(url)
    conn = urllib2.urlopen(req,timeout=2)
    detected_pip = conn.read()
    
    proxy_detected = detected_pip 
  
  except urllib2.HTTPError, e:
    print "ERROR: Code ", e.code
    return False
  except Exception, detail:
    print "ERROR: ", detail
    return False
  
  return proxy_detected

import sys
file = open(sys.argv[1],'r')
import re
sum = 0
p = re.compile('([\d,\.]+)\s(\d+).*')
for line in file:
    match = p.match(line)    
    if not match or match.groups().__len__() != 2:
        continue
    ip = '%s:%s' % (match.group(1),match.group(2))
    cnt = 5
    while cnt > 0:
        cnt = cnt  - 1
    	url = ('http://model.100autoshow.com/vote/index/id/170.html?num=%.0f' % (time.time()*1000))
    	ret = get('http',ip,url)
        if isinstance(ret, basestring):
            sum = sum + 1
        print ip,ret,sum 
