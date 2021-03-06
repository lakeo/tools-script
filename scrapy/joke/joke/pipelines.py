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
        ret = self.db.query_tuple_row("select 1 from joke where `md5code`=%s limit 1", self.getKey(item))
        if ret:
            raise DropItem('duplicate item')
        if not item['images'] and not item['content']:
            raise DropItem('empty item')

        self.db.insert('insert joke(source,title,content,images,ctime,md5code,source_like,source_unlike,source_comment,source_view) values (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)',
                      item['source'],
                       item['title'],
                       item['content'],
                       item['images'],
                       int(time.time()),
                       self.getKey(item),
                       int(item['like'] if 'like' in item and item['like'] else 0),
                       int(item['unlike'] if 'unlike' in item and item['unlike'] else 0),
                       int(item['comment'] if 'comment' in item and item['comment'] else 0),
                       int(item['view'] if 'view' in item and item['view'] else 0))
        return item;

    def getKey(self,item):
        return hashlib.md5(item['content'].encode('unicode_escape').join(item['images'])).hexdigest()