# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: http://doc.scrapy.org/en/latest/topics/item-pipeline.html
from scrapy.exceptions import DropItem
import SimpleDB
import hashlib
import time

def getDB():
    return SimpleDB.MySQLdb(
                host='localhost',
                port = 3306,
                user='joke',
                passwd='joke',
                db ='joke',
                use_unicode=True,
                charset='utf8')

class DuplicatesPipeline(object):
    def __init__(self):
        self.db = getDB()

    def process_item(self, item, spider):
        #spider.logger.info('in duplicate piplines, %s', str(item).decode("unicode_escape"))
        ret = self.db.query_tuple_row("select 1 from joke where `md5code`=%s limit 1", (hashlib.md5(item['content'].encode('unicode_escape')).hexdigest(),))
        if ret:
            raise DropItem('duplicate item')

        self.db.insert('insert joke(source,title,content,images,ctime,md5code) values (%s,%s,%s,%s,%s,%s)',
                      item['source'],
                       item['title'],
                       item['content'],
                       item['images'],
                       int(time.time()),
                       hashlib.md5(item['content'].encode('unicode_escape')).hexdigest())
        #spider.logger.info('in duplicate piplines, %s', str(item).decode("unicode_escape"))
        return item;