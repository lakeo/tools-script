import os
import sys
import re

if len(sys.argv) <= 1:
	print 'invalid input '
	exit
i=0
while i < len(sys.argv) -1 :
	i = i+1
	f = open(sys.argv[i],'r')
	for ip in f:
		m = re.match('(.*\s\d+)',ip)
		ip = m.group(0)
		cmd = ('nc -z -G 1 -w 1 %s ' % ip)
		os.system(cmd)
