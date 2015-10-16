import time
import urllib2
import sys
import re
import os

def get(protocol, pip, url): 
  try:
    proxy_handler = urllib2.ProxyHandler({protocol:pip})
    opener = urllib2.build_opener(proxy_handler)
    #opener.addheaders = [('User-agent', user_agent)] 
    urllib2.install_opener(opener)
 
    req = urllib2.Request(url)
    conn = urllib2.urlopen(req,timeout=3)
    detected_pip = conn.read()
    
    proxy_detected = detected_pip 
  
  except urllib2.HTTPError, e:
    print "ERROR: Code ", e.code
    return False
  except Exception, detail:
    print "ERROR: ", detail
    return False
  
  return proxy_detected

urls = ['http://www.xicidaili.com/nn/%s',
		'http://www.xicidaili.com/nt/%s',
		'http://www.xicidaili.com/wn/%s',
		'http://www.xicidaili.com/wt/%s']
urls_cnt = [220,87,139,247]
url_index=0
url_index_index=1

import threading
mutex = threading.Lock()
def geturl():
	global url_index_index,url_index,urls_cnt
	url_index_index += 1
	if url_index_index >= urls_cnt[url_index]:
		url_index = (url_index+1) % 4
		url_index_index = 1
	return (urls[url_index] %  url_index_index)

#ips=['xxx:xx']
def getips():
	ips = []
	if mutex.acquire(1): 
		url = geturl()	
		print url
		os.system('curl ' + url + ' > tmp')
		content = open('tmp','r').read()
		m = re.findall(r'<tr class="">.*?</tr>', content, re.S)
		for r in m :
			m2 = re.findall(r'<td>(.*?)</td>',r,re.S)
			ips.append('%s:%s' % (m2[2],m2[3]))
		mutex.release()
	return ips

def run(ip):
	cnt = 5
	sum=0
	while cnt > 0:
		cnt = cnt  - 1
		url = ('http://model.100autoshow.com/vote/index/id/170.html?num=%.0f' % (time.time()*1000))
		ret = get('http',ip,url)
		if isinstance(ret, basestring):
			sum = sum + 1
	print ip,sum
	return sum


def worker(id):
	sum = 0
	while True:
		ips = getips()
		for ip in ips:
			sum += run(ip)
		print ('in thread %s ' % id) , sum
class mythread(threading.Thread):
	def __init__(self, id):
		self.id = id 
		threading.Thread.__init__(self)

	def run(self):
		worker(self.id)	

num = 1 
if len(sys.argv) >=2:
	num = int(sys.argv[1])
if __name__ == '__main__':
	i=0
	while(i < num):
		i += 1
		thread = mythread(i)
		thread.setDaemon(False)	
		thread.start()
