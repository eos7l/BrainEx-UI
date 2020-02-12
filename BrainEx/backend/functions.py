import os

import genex.database.genexengine as gxdb
from genex.utils.gxe_utils import from_csv

from pyspark import SparkContext, SparkConf

from flask import Flask, request, jsonify
from flask_cors import CORS

import pandas as pd

UPLOAD_FOLDER = "./uploads"

application = Flask(__name__)
CORS(application)
application.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

uploadPath = None
brainexDB = None
querySeq = None
numFeatures = None

def is_csv(filename):
    if '.' in filename and filename.rsplit('.', 1)[1].lower() == 'csv':
        return True
    else:
        return False

@application.route('/getCSV', methods=['GET', 'POST'])
def getStoreCSV():
    global uploadPath, numFeatures

    if request.method == 'POST':
        if 'uploaded_data' not in request.files:
            return ("File not found.", 400)
        csv = request.files['uploaded_data']
        if csv.filename == '':
            return("File not found", 400)
        if csv and is_csv(csv.filename):
            toSave = os.path.join(application.config['UPLOAD_FOLDER'], csv.filename)
            csv.save(toSave) # Secure filename?? See tutorial
            uploadPath = toSave
            dataframe = pd.read_csv(uploadPath, delimiter=',')
            dataframe.columns = map(str.lower, dataframe.columns)
            if not 'start time' in dataframe.columns and not 'end time' in dataframe.columns:
                return("Please include a start and end column", 400)
            else:
                maxVal = (dataframe['end time'] - dataframe['start time']).max()
                notFeature = 0
                for elem in dataframe.columns:
                    if 'unnamed' in elem:
                        notFeature = notFeature + 1;
                numFeatures = len(dataframe.columns) - notFeature
                returnDict = {
                    "message": "File has been uploaded.",
                    "maxLength": str(maxVal)
                }
                return jsonify(returnDict)
        else:
            return("Invalid file.  Please upload a CSV", 400)

@application.route('/build', methods=['GET', 'POST'])
def build():
    global brainexDB, uploadPath, numFeatures

    if request.method == 'POST':
        try:
            return(request.json['spark_val'])
            num_worker = int(request.json['num_workers'])
            use_spark_int = int(request.json['spark_val'])
            if use_spark_int == 1:
                use_spark = True
                driver_mem = int(request.json['dm_val'])
                max_result_mem = int(request.json['mrm_val'])
            else:
                use_spark = False
            try:
                if use_spark:
                    brainexDB = from_csv(uploadPath, feature_num=numFeatures, use_spark=use_spark, num_worker=num_worker, driver_mem=driver_mem, max_result_mem=max_result_mem)
                else:
                    brainexDB = from_csv(uploadPath, feature_num=numFeatures, use_spark=use_spark, num_worker=num_worker)
                similarity_threshold = float(request.json['sim_val'])
                dist_type = request.json['distance_val']
                lois = request.json['loi_val']
                loitoSp = lois.split('[')[1]
                loitoSp2 = loitoSp.split(']')[0]
                loiA = loitoSp2.split(',')
                loi = [float(loiA[0]), float(loiA[1])]
                try:
                    brainexDB.build(st=similarity_threshold, dist_type=dist_type, loi=loi)
                    return "Preprocessed!"
                except Exception as e:
                    return (str(e), 401)
            except FileNotFoundError:
                return ("File not found.", 402)
            except TypeError:
                return ("Incorrect input.", 403)
        except Exception:
            return("One more", 404)

@application.route('/uploadSequence', methods=['GET', 'POST'])
def uploadSequence():
    if request.method == "POST":
        # Assuming the file is just a series of points on one line (i.e. one row of a database
        # csv with feature_num=0)
        if 'sequence_file' not in request.files:
            return ("File not found.", 400)
        csv = request.files['sequence_file']
        if csv.filename == '':
            return("File not found", 400)
        if csv and is_csv(csv.filename):
            csv.save(os.path.join(application.config['UPLOAD_FOLDER'], file.filename)) # Secure filename?? See tutorial
            # Check to make sure there's only one line there
            with open(file.filename) as f:
                numLines = sum(1 for line in f)
            if numLines == 1:
                with open(file.filename) as f:
                    queryLine = f.readline()
                    query = queryLine.rstrip.split(',')
                return "File has been uploaded."
            else:
                return("Please only submit one sequence at a time", 400)
        else:
            return("Invalid file.  Please upload a CSV", 400)

@application.route('/query', methods=['GET', 'POST'])
def complete_query():
    if request.method == "POST":
        quit()
