import mariadb
import sys
from os import getenv

def dB_connect():
    dbInfo=getDbInfo()
    try:
        conn = mariadb.connect(
            user=dbInfo['nuConfigDBUser'],
            password=dbInfo['nuConfigDBPassword'],
            host=dbInfo['nuConfigDBHost'],
            port=3306,
            database=dbInfo['nuConfigDBName']
        )
        return conn
    except mariadb.Error as e:
        print(f"Error connecting to MariaDB Platform: {e}")
        sys.exit(1)
    return conn

dbInfo = {}
def getDbInfo():
    global dbInfo
    dbInfo['nuConfigDBHost'] = getenv('nuConfigDBHost', None)
    dbInfo['nuConfigDBName'] = getenv('nuConfigDBName', None)
    dbInfo['nuConfigDBUser'] = getenv('nuConfigDBUser', None)
    dbInfo['nuConfigDBPassword'] = getenv('nuConfigDBPassword', None)
    assert dbInfo['nuConfigDBHost']
    assert dbInfo['nuConfigDBName']
    assert dbInfo['nuConfigDBUser']
    assert dbInfo['nuConfigDBPassword']
    return dbInfo

def run_query(query):
    conn = dB_connect()
    cursor = conn.cursor()  # Get cursor for database access
    debug = True
    debug and print(f"Executing query: {query}")
    try:
        cursor.execute(query)
        conn.commit()
    except mariadb.Error as e:
        sys.stderr.write(f"Error while running query: {query}...")
        sys.stderr.write(f"Read(): Error is: {e}")
        raise

import random
import string
def getCodeForSsoReq(length):
    code = ''.join([random.choice(string.ascii_letters
                      + string.digits) for n in range(length)])
    return code

import datetime, pytz
def getHumanReadableDateTime(time=None):
    if time is None:
        time = datetime.datetime.now(datetime.timezone.utc)
    # To check available timezones:-
    # from pytz import all_timezones
    # print(all_timezones)
    tz = pytz.timezone('Asia/Taipei')
    time = time.replace(tzinfo=tz)
    humanReadableDateTime = str(time.now(tz))
    return humanReadableDateTime

import time
def write_entry_to_sso_login_db_table(users_name, users_email):
    table_name = 'zzzzsys_sso_login'
    code_length = 25
    table_structure = {"sso_email": "VARCHAR(255) PRIMARY KEY",
                       "sso_name": "VARCHAR(100)",
                       "sso_login_time": "VARCHAR(100)",
                       "sso_login_time_s": "INT UNSIGNED",
                       "sso_processed": "BOOLEAN",
                       "sso_code": f"VARCHAR({code_length})"}
    code = getCodeForSsoReq(code_length)
    field_names = table_structure.keys()
    fnames = []
    fname_and_types = []
    for fname in field_names:
        fname_and_type = fname + " " + table_structure[fname]
        fnames.append(fname)
        fname_and_types.append(fname_and_type)
    fname_and_types_txt = ", ".join(fname_and_types)
    query=f"CREATE TABLE if not exists {table_name} ({fname_and_types_txt});"
    run_query(query)

    s_since_epoch = str(int(time.time()))
    my_time = getHumanReadableDateTime()
    values = []
    values.extend([users_email, users_name, my_time, s_since_epoch, str(0), code])
    values_txt = "'" + '\', \''.join(values) + "'"
    fields_txt = ", ".join(fnames)
    query=f"REPLACE INTO {table_name} ({fields_txt}) VALUES ({values_txt});"
    run_query(query)
    return code
