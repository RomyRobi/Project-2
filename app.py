import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

#################################################
# Database Setup
#################################################

## "create_engine" method
# engine = create_engine("sqlite:///db/airbnb-sqlite.db")
#
# # reflect an existing database into a new model
# Base = automap_base()
# # reflect the tables
# Base.prepare(engine, reflect=True)
#
# # Save references to each table
# NYC = Base.classes.nyc
#
# session = Session(engine)

# app method
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/airbnb-sqlite.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = True
db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table
nyc = Base.classes.nyc
# nyc_hist = Base.classes.nyc_hist



@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/api/nyc/metadata")
def listings_names():
    """Return listings metadata."""


    # Use Pandas to perform the sql query

    # stmt = db.session.query(NYC).statement
    # df = pd.read_sql_query(stmt, db.session.bind)

    stmt = db.session.query(nyc).statement
    df = pd.read_sql_query(stmt, db.session.bind)


    # Return a list of the column names (sample names)s
    return jsonify(list(df.columns)[2:])
    # results =db.session.query()

    # return jsonify(list(NYC.columns))


# @app.route("/api/nyc_hist/metadata")
# def historical_names():
#     """Return historical metadata."""
#
#     # Use Pandas to perform the sql query
#     stmt = db.session.query(nyc_hist).statement
#     df = pd.read_sql_query(stmt, db.session.bind)
#
#     # Return a list of the column names (sample names)
#     return jsonify(list(df.columns)[2:])
#


@app.route("/listings_data")
def listings_data():
    """Return the Data from the nyc table (listings.csv)."""

    stmt = db.session.query(nyc).statement
    df = pd.read_sql_query(stmt, db.session.bind)
    df["latitude"] = pd.to_numeric(df["latitude"])
    df["longitude"] = pd.to_numeric(df["longitude"])
    df["accommodates"] = pd.to_numeric(df["accommodates"])

    data = df.to_dict(orient='index')
    # Create a dictionary entry for each row of metadata information
    # data = {}
    # for result in results:
    #
    #     data["ID"] = result[0]
    #     data["LISTING_URL"] = result[1]
    #     data["NAME"] = result[2]
    #     data["HOST_ID"] = result[3]
    #     data["NEIGHBORHOOD"] = result[4]
    #     data["NEIGHBORHOOD_GROUP"] = result[5]
    #     data["CITY"] = result[6]
    #     data["ZIPCODE"] = result[7]
    #     data["LAT"] = float(result[8])
    #     data["LON"] = float(result[9])
    #
    # print(data)

    return jsonify(data)

# @app.route("/historic_data")
# def historic_data():
#     """Return the Data from the nyc table (historic.csv)."""
#
#     stmt = db.session.query(nyc_hist).statement
#     df = pd.read_sql_query(stmt, db.session.bind)
#
#     data = df.to_dict(orient='index')
#
#     return jsonify(data)
#



if __name__ == "__main__":
    app.run()
