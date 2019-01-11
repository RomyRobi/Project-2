import csv,sqlite3
from sqlite3 import Error
import pandas as pd


def create_connection(db_file):
    """ create a database connection to a SQLite database """
    try:
        conn = sqlite3.connect(db_file)
        cur = conn.cursor()
        cur.execute("CREATE TABLE nyc_hist (id INTEGER PRIMARY KEY, Date TEXT, Price INTEGER, Neighborhood INTEGER, \
                    Borough TEXT, Latitude TEXT, Longitude TEXT, Review TEXT, Room_Type TEXT);")
        csvfile = "historical_data.csv"
        df = pd.read_csv(csvfile, keep_default_na = False)
        print(df.head())
        df.to_sql("nyc_hist", conn, if_exists='append', index=False)
        conn.commit()
        conn.close()
        print("Data Transfer Complete")



    except Error as e:
        print(e)
    finally:
        conn.close()

if __name__ == '__main__':
    create_connection("../db/airbnb-sqlite.db")
