import csv,sqlite3
from sqlite3 import Error
import pandas as pd


def create_connection(db_file):
    """ create a database connection to a SQLite database """
    try:
        conn = sqlite3.connect(db_file)
        cur = conn.cursor()
        cur.execute("CREATE TABLE nyc (id ,listing_url ,name ,host_id ,\
                    neighbourhood_cleansed ,neighbourhood_group_cleansed ,\
                    city ,zipcode , latitude,longitude, property_type, room_type,accommodates, \
                    amenities,price, number_of_reviews ,first_review date,review_scores_rating );")
        csvfile = "listings.csv"
        df = pd.read_csv(csvfile)
        print(df.head())
        df.to_sql("nyc", conn, if_exists='append', index=False)
        conn.commit()
        conn.close()
        print("Data Transfer Complete")



    except Error as e:
        print(e)
    finally:
        conn.close()

if __name__ == '__main__':
    create_connection("../db/airbnb-sqlite.db")
