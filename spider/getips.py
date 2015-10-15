URL = 'http://120.26.202.49:80/wt/%s'
sum = 247 
i=0

import urllib2
import os 
import re

while i < sum:
	i = i+1
	url = URL % i
	os.system('curl ' + url + ' > tmp')
	content = open('tmp','r').read()
	m = re.findall(r'<tr class="">.*?</tr>', content, re.S)
	for r in m :
		m2 = re.findall(r'<td>(.*?)</td>',r,re.S)
		print m2[2],m2[3]
