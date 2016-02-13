import SimpleDB
import hashlib

db =  SimpleDB.MySQLdb(
                host='localhost',
                port = 3306,
                user='joke',
                passwd='joke',
                db ='joke',
                use_unicode=True,
                charset='utf8')


def getKey(item):
        return hashlib.md5(item['content'].encode('unicode_escape').join(item['images'])).hexdigest()

sql = 'select id,content,images,md5code from joke'
rows = db.query_dict(sql)()
jokes = []

for r in rows:
    jokes.append(r)

update = 'update joke set md5code = %s where id = %s'

for j in jokes:
    key = getKey(j)
    if j['md5code'] != key:
        db.update(update,key,j['id'])