#BrainEx GUI Documentation
######A guide to installing and using the BrainEx application

Use this application in fullscreen mode for best results.

##Installation
Note: This app was developed on Windows 10 OS, but additional directions for MacOS and Linux are supplied when possible. Any operating system-specific additions are welcome.

###Required software

It is necessary for the machine that Brainex is running on to have the following software installed and configured:
1. [Python](https://www.python.org/downloads/) 3.6 or 3.7 (Python 3.8 has some known issues with packages used by this application and the backend requires 3.6 or greater) with pip included
   1. Add the path to the python.exe and the Scripts folder to PATH
      1. For more information on how to add environment variables on Windows, Linux and MacOS, refer to [this link](https://www.schrodinger.com/kb/1842)
      1. Note: for environment variables to take effect, the command window must be opened after they are set.<br>
   1. To check if Python is properly installed, or to see what version of python is on your current machine, open a new command prompt and execute the following command:
      1. Windows and Linux: `python --version`
      1. MacOS: `python -version`
For more information on how to verify your python installation/version, refer to [this link](https://phoenixnap.com/kb/check-python-version).
1. [Node.js](https://nodejs.org/en/download/) (npm is required to run the React app)
   1. To check if node is properly installed execute the command `node --version` in a new terminal.
1. Microsoft Visual C++ Build Tools ([install](https://go.microsoft.com/fwlink/?LinkId=691126) with default options)
1. [Java 8](https://www.oracle.com/java/technologies/javase/javase-jdk8-downloads.html) (required for Spark)
   1. To check if java is properly installed (and that you have the right version), execute the command `java -version`.
1. If you are on Windows, you will need additional software to unzip the Spark installation. We recommend [7zip](https://www.7-zip.org/) as it is free and can handle .tgz unzips.
1. [Spark/Pyspark](https://spark.apache.org/downloads.html) (Please note that while PySpark is available for Pip install, environmental variables must be set to get the install to work properly)
   1. Windows [installation and configuration](https://www.folio3.ai/how-to-install-spark-pyspark-on-windows/)
   1. MacOS [installation](https://kevinvecmanis.io/python/pyspark/install/2019/05/31/Installing-Apache-Spark.html)
   1. Linux [installation](https://www.roseindia.net/bigdata/pyspark/install-pyspark-on-ubuntu.shtml)
   1. To verify that Spark is installed correctly, open a command terminal and execute the command `pyspark --version`
   1. If Spark is unable to be installed, you will still be able to run the functionalities of the app, though not to their best ability.

###Installing the application

####Cloning/Downloading Github repository

If you wish to use an IDE, we recommend installing [Pycharm](https://www.jetbrains.com/pycharm/download/#section=windows) (Community Edition should be sufficient) with the default options and install the “JavaScript and TypeScript” bundled plugin. On startup of the IDE, you can select “Checkout from Version Control” and clone the [Github repository](https://github.com/krbrez/BrainEx-UI.git) this way. If there are any remote changes on the gitHub repository you wish to retrieve, check out [how to sync with a remote repository on Pycharm](https://www.jetbrains.com/help/pycharm/sync-with-a-remote-repository.html) for instructions on how to use the IDE for version control.

If you are not using an IDE or simply prefer using git through the command line, open a command prompt and navigate to the location you wish to install the application. Then, execute the following command:

`git clone https://github.com/krbrez/BrainEx-UI.git`

If there are any remote changes to the application, just execute `git pull origin` in the command line from within the project directory.

Alternatively, you can open this [github link](https://github.com/krbrez/BrainEx-UI.git) and download the repo as a zip file. Then, simply extract the containing files to the desired installation location. To update the application in this case would require re-downloading the application and completing the following installation instructions again.

**Please note that the Github repository for the BrainEx UI includes a frozen version of the Genex backend.  If any major changes are made to Genex, the version in this repository will not be updated automatically.**

####Installing dependencies

Though it is not required, if you wish to use a virtual environment ([directions](https://www.jetbrains.com/help/pycharm/creating-virtual-environment.html) for Pycharm) for this project (especially if you have multiple versions of Python installed), you will want to configure the Python interpreter with the version of Python that you want prior to installing any dependencies. If you are not using an IDE and still wish to do this through the command line, try referring to [this link](https://docs.python.org/3.7/library/venv.html). 

Otherwise, as long as the `--user` option is included in the pip installation command, packages should install without additional permission required.

If you are running this on a Windows operating system, you can simply execute the following command: `run_all.bat` and it will open two command prompts and simultaneously install npm and python dependencies and run both the React app and the Flask server.

Otherwise, execute the following commands approximate commands on your machine:
* To set up the backend:
   1. `venv/scripts/activate` (only if using virtual environment)
   1. `python -m pip install --user requirements.txt`
   1. `cd Brainex/backend`  (when you are in the BrainEx-UI root directory)
   1. `set FLASK_APP=functions.py`
   1. `flask run`
      * This may need to be replaced by ‘python -m flask run’ if your Python Path is not configured properly.

* To set up the frontend (in a separate terminal/command window):
   1. `cd Brainex` (when you are in the BrainEx-UI root directory)
   1. `npm install`
   1. `npm start`

Once the development server is started and compiles, it should open a window in your default browser. If it does not automatically open, using the browser of your choice navigate to `localhost:3000`. If you wish, you can create a shell script for your non-Windows operating system, add it to the root directory and use that when you want to come back to the application.

Additionally, if you are using a virtual environment, the genex folder, while included in the root directory of the repo, will also be needed to be added to site-packages within the lib folder of the virtual environment.

####Installation Troubleshooting
* If pip is not found, execute this command in the root directory (/BrainEx-UI): `python get-pip.py`
* If upon running the backend you receive any “module not found” errors (that are not genex) just execute `python -m pip --user install <package name>` in the root directory.
* If any problem persists with node modules, try deleting the `package-json.lock` file and node_modules folder and execute `npm install` again.

##About the Application

###Overview

BrainEx finds the k most similar sequence matches from within a dataset using a given individual query sequence. The advantage of this application is that querying time is reduced due to the similarity grouping done during preprocessing. Currently the application is capable of the following use cases:
* Uploading a raw dataset and/or choosing a raw dataset, preprocessing it for use, and querying with a sequence of the same number of identifiers (i.e. SubjectID, EventName and SubjectID, ChannelNum). The general path of this use case would be Home > Select a new dataset > Preprocessing options > Preprocessing progress menu > Find Similar Sequences.
* Choosing a preprocessed dataset and proceeding straight to querying, and using a query sequence with the same number of identifiers. The general path of this use case would be Home > Find Similar Sequences.

####General File Structure
```
+-- BrainEx-UI
|  +-- BrainEx
|  |  +-- Backend: contains files relevant to the backend
|  |  |  +-- tests
|  |  |  |  +-- Test_functions.py: functions used to test some of the Python backend
|  |  |  +-- Uploads
|  |  |  |  +-- Preprocessed: contains all uploaded preprocessed files. These will appear on the Home page
|  |  |  |  +-- Raw: contains all raw files. These will appear on Select a new dataset.
|  |  |  +-- Functions.py: the Python backend that receives http requests from the frontend and parses them to work with BrainEx functionality
|  |  +-- Node_modules: when `npm install` is executed, this folder will be created. It will contain all installed packages.
|  |  +-- Src: contains files relevant to the React front end
|  |  |  +-- Components: folder containing the individual components of this app. The main components are described below in Application tour
|  |  |  |  +-- Preprocessing: contains files relevant to the preprocessing pipeline
|  |  |  |  +-- Singletons: contains files that should only exist as once instance across the app (i.e. header and navigation bar)
|  |  |  +-- Data: contains default data as well as dummy data used to develop this app
|  |  |  +-- Stylesheets: contains any styling for the app. If a component does not have a dedicated stylesheet, the parent stylesheet is what is being applied (e.g. App.css also applies to any component within the app as it is the highest parent, but child CSS will override it if they exist)
|  |  |  +-- App.js: the highest class/parent of the application. Contains all relevant Router info for navigation to each page
|  |  |  +-- Brain.svg: the app logo
|  |  |  +-- Index.js: file that servers the main App.js
|  |  |  +-- serviceWorker.js: a file that can allow the React frontend to work offline and load faster. See the file contents for more detail. This file will only be used if the function called in index.js is changed from unregister() to register()
|  |  |  +-- README.md: a readme file provided by React that details available scripts
|  |  |  +-- Test.py: more test functions for testing backend functionality
|  |  +-- Package.json: contains package dependencies to run React frontend. This is what is installed when `npm install` is executed. Executing `npm install --save <package>` will add the package to this file as well as install it
+-- Example_files: contains example CSV files for raw datasets as well as query sequence CSV files
+-- genex: folder containing the Genex package/API (when Genex is available as a pip package, use that instead)
+-- Saved_Preprocessed: folder containing the saved preprocessed datasets in zip file format
+-- Saved_Results: folder containing saved query results in a parsable format. Currently not outputted as a CSV file
+-- Venv (if you are using one for this project): contains virtual environment information such as scripts and installed packages
   +--Lib
   |  +-- Site-packages: this is where you would paste the genex package if you were using a virtual environment
+-- .gitignore: contains the names of files and folders that should not be pushed to the repo and therefore not tracked by git.
+-- Brainex.bat: script to start the front-end React app
+-- LICENSE: MIT license
+-- README.md: the file you are currently viewing
+-- requirements.txt: names of required Python packages to be able to run the backend and Genex
+-- run_all.bat: script to run both the front-end and backend in two separate terminals
+-- server.bat: script to run the Python backend
```

###Application tour

####Home

This is the initial/main page of the app. It has 3 main elements. 
* A user can upload a preprocessed dataset created by this application, which comes in the form of a compressed (“zip”) file that contains the necessary information for the application to use. The zip file must be created by this application or in the exact format to be of valid use.
* If the user clicks on a preprocessed file from the left side of the screen, a dialog will appear asking the user if they wish to proceed with this dataset, and to verify the Spark context parameters (number of workers, driver memory, max result memory). The user will then be brought to the “Find Similar Sequences” page upon confirmation of the parameters.
* On the right hand side of the screen, there is a brief description of the app and a button to instead choose a new, raw dataset. This will bring the user to the next screen, “Select a new dataset”

####Select a new datase

This page is for selecting a new, raw dataset rather than a preprocessed one. Users may also upload new datasets to their local copy of the application.

Listed below are the requirements of new datasets:
1. The dataset must be a CSV file of time series data.
1. The first row of the dataset must contain the headers/identifiers of the dataset
1. Any column header for a column containing the time series data points must be blank
1. The dataset should have at least 1 header/identifier.

When the user selects a dataset from the left side of the screen, a preview of the file contents will be displayed on the right side, including headers. The unlabeled time series data are given the nickname “unnamed #”. Upon clicking a dataset, the “Proceed to Preprocessing” button will activate and the user will be able to go to the next screen.

####Preprocessing options

The purpose of this page is to select the parameters with which the backend should preprocess your raw dataset. The screen begins with the recommended defaults displayed (Distance type: Euclidean with Dynamic Time Warping (DTW), Similarity Threshold: 0.1, Length of Interest: entire dataset, and preprocess without using Spark).

The parameters for the preprocessing stage are as follows:

#####Distance Type

This option is Euclidean with Dynamic Time Warping (DTW) by default.

This is the distance type used for similarity calculations. The choices are Euclidean with DTW), Manhattan with DTW, Minkowski with DTW, and Chebyshev with DTW. These options really only differ in how the similarity/distance is calculated, so the appropriateness is up to user preference.

#####Similarity Threshold

This option is set to 0.1 by default.

This parameter determines the upper bound of the similarity value between two time series. It is on a scale of [0:1]. The closer the threshold is to 0, the more similar the matches must be to be grouped together (and vice versa). For example, if the user sets the similarity threshold to 0, each sequence would be in a cluster/group consisting of only itself. If the user were to set the threshold to 1, then one large group of sequences for each specific length would be created.

#####Lengths of interest

This option is set to all lengths by default. 

Lengths of interest refers to the interval of sequence lengths into which the user wishes to query. Grouping/clustering will be done only on the sequences of length within the given interval. All outside sequence lengths will not be included and therefore will not be queried. To achieve the “all lengths” setting again, just set the interval to the lowest and highest values allowed by the slider/input.

#####Number of Workers

This option is 4 by default and is required for preprocessing with and without Spark.

Number of workers refers to the number of cores that will be used to run the preprocessing algorithm. Please do not exceed the number of cores on your machine. You can check the number of cores on your machine through the performance tab on your task manager.

#####Preprocess using Spark

This option is deselected by default.

When this option is selected (to select it simply check the checkbox), additional options will appear to the right for memory allocation. If the Spark installation is found to be invalid, an error will occur and the options will not appear.  These parameters, Driver Memory and Max Result Memory (both 16 GB by default), are used to configure the Spark Context.

When this option is not selected, the dataset will be preprocessed using Python Native Multiprocessing. Using this option may cause preprocessing and querying to take longer than if using Spark for larger datasets, but for smaller datasets the difference is negligible.

####Preprocessing progress menu

#####During preprocessing

This page will show an indeterminate progress bar while the dataset is being preprocessed. The user will also be presented with the options to cancel preprocessing and return to the previous screen (preprocessing options) or cancel preprocessing and return to the home page. If you are preprocessing while using Spark, the backend terminal will show the progress of the Spark tasks/jobs. It may hang for some time before starting Stage 0 but then it will progress quite steadily.

#####After preprocessing is complete

Once preprocessing is complete, the screen will show a filled progress bar and the user will be presented with the option to restart with another dataset (and return to home), to proceed to find similar sequences, and/or to download the preprocessed dataset to the local root directory in a folder called “Saved_Preprocessed”. The dataset will be saved as a zip file containing the necessary information for the application to use in the future.

Note: It is important to go through the proper channels if you wish to restart with another dataset, especially if you are using Spark. In order to correctly end your Spark session, you may select either cancel button, the “restart with another dataset” button, as well as the “Home” button on the “Find Similar Sequences” page.  The browser “back” button is not sufficient in this case.

####Find Similar Sequences

This page contains the main functionality of this application, finding the k best matches to a given query sequence.

#####Query Options

There are three available parameters for querying into the given dataset:

* Query sequence: a full row of data (identifiers, data points, etc.) copied from a dataset into another CSV file. This does not include any headers. The sequence must have the same number of identifiers as the dataset into which you are querying.
* Number of best sequence matches: the number of sequence matches the backend will return. This value must be equal to or less than the number of sequences within the preprocessed dataset. However, this does not guarantee that there will be matches close to the given query sequence. The max number of matches allowed for the particular dataset is displayed below this field, and depends on the number of subsequences collected during preprocessing.
* Overlap: This value determines how much the sequence matches will overlap with each other. For example, if you set the overlap value to 40, then no two matches in the query result will overlap by more than 40%.
* Exclude subsequence matches from current sequence: This checkbox indicates whether or not any sequences with the same sequence id (a concatenation/tuple of the identifier values) will be considered in the match ranking process. This field is most relevant when the query sequence comes from within the chosen dataset.
* *Lengths of interest: This feature is not currently implemented in the Genex package. In theory, you would be able to query for specific sequence lengths within the lengths of interest that was originally provided before preprocessing.*

To start the querying process, the user must have a query sequence selected and valid input for the above options and then select “Start Query”. The query may take some time depending on how the dataset was preprocessed and the k number of matches requested but when it returns the graph, table, and stats will populate with the results. To clear the results, the user can click “Clear Options”, which will clear the currently selected options, not including the query sequence.

#####Query Results

This portion of the page displays the query results in both graph and table format. The “Ranked Sequence Matches” table includes the following information:

* Show: checkboxes to toggle an individual sequence’s visibility in the graph. There is also a select all/deselect all checkbox in the header cell. With the current implementation, if the user were to uncheck all sequences individually, then the most recently displayed sequence would still appear on the graph. This column is color coded using a gradient scale between blue and orange with blue being the most similar match and orange being the least similar match. The colors correspond to the sequence’s line color in the graph.
* Rank: the sequence’s match rank (#1 being the best match)
* Sequence ID: a unique sequence identifier consisting of the concatenated row identifiers
* Start Time, End Time: The start and end time of the sequences as points in the data set
* Similarity: The percentage of similarity between this match and the query sequence. The closer to 100% the more similar the match is.
* Thumbnail: A color-coded thumbnail of the sequence showing the user its general shape. The color corresponds to its color in the graph.

The “Query Results” plot includes the sequences toggled to be shown in the graph, where the user can view and use the brushing tool below the plot to zoom into a specific interval of the graph. Simply click and drag each side to the desired area and click again to release. There is also a legend that displays the color and sequence IDof each displayed line. This legend will possibly become legible as more and more matches are requested. 

####Known limitations

1. We recommend using this application in fullscreen mode for the best results and experience.
1. Refreshing the page may cause the application to lose track of some relevant variables.  If you have refreshed by mistake, return to the beginning of the pipeline through the proper channels (not through the browser back button).

##Using the application

Once the dependencies for the application are properly installed (see "Installation"), the application is ready to be used. The user can execute the “run_all.bat” Windows batch script in order to start both the backend server and the BrainEx front end (“server.bat” and “brainex.bat”, respectively), and the default browser should open to “localhost:3000”. If the browser does not automatically open, typing this into any browser that supports JavaScriptwill work. The application will open up to the Home page and files from the path `BrainEx-UI/BrainEx/backend/uploads/preprocessed’ (this is the path for uploaded preprocessed datasets) should populate on the left side `.

###Use case tutorial: Querying with a raw dataset

To use a new, raw dataset, select “Preprocess with a new dataset” on the Home page. The following page, “Select a new dataset”, will show the files stored in the folder `BrainEx-UI/BrainEx/backend/uploads/raw`. If you have a dataset on your local machine you wish to upload to the application, you can do so using the “Choose File” button below the file list. The file should follow the format outlined in "Select a new dataset" in order to be valid. 

Selecting a file from the list will activate the “Proceed to Preprocessing” button and cause a paginated table of the file’s contents to populate to the right. There may be some delay, during which “No Data” will be displayed in its place. When the preview appears, it will show 10 rows at a time, and the rest can be viewed by paging through using the table controls.

When you have selected the dataset you want to preprocess, clicking “Proceed to Preprocessing” will bring you to the Preprocessing options page. Here, you can use the default selections or enter your own. See "Preprocessing Options" for more detail on each option. If you select “Preprocess using Spark”, the application will verify that Spark/Pyspark is properly installed. If it isn’t, you will be notified. Otherwise, additional Spark/Pyspark parameters will appear.

Once you are satisfied with the selected preprocessing options, click “Start Preprocessing”, and you will be brought to the Progress page. While preprocessing is happening, the only options presented are to cancel and return to either Preprocessing options or the Home page. This will properly end the current Spark/Pyspark session so that another one may be created. A notification will appear when this happens successfully. Otherwise, once preprocessing is complete the screen will change to have the options to restart with another dataset (which will also properly end the current Spark/Pyspark session), to find similar sequences, and/or to download the preprocessed dataset.

Clicking on “Download the preprocessed dataset” will cause a spinning progress circle to appear while the download is in progress. Once the download is complete, the circle will disappear and a notification will appear indicating that it has been saved in the “Saved_Preprocessed” folder. This folder is located in the root directory of the project and contains compressed (“zip”) files of preprocessed datasets.

To query into this preprocessed dataset, select “Find similar sequences” to proceed to that page. Here, you will see querying parameters available on the left side, as well as an unpopulated statistics window, empty table, and empty graph. To select a query sequence, choose the file from your local machine. The query sequence file must contain only a single row of data taken from the same dataset or a dataset with the same number of identifiers. See "Query Options" for more information. 

After entering the number of matches and overlap values, or using the defaults, clicking “Start Query” will initiate the querying process. While the matches are being found, a loading overlay will appear over the graph. On completion of the query, the table and graph will populate with all the matches. To toggle the visibility of each sequence on the graph, select/deselect the row in the table. To save the query results into a CSV file, click on the “Save Query Results” button at the bottom of the table. This will create a CSV file and store it in the “Saved_Results” folder of the project root directory.

##Use case tutorial: Querying with a preprocessed dataset

This use case begins from the Home page as well. However, instead of selecting the “Preprocess a new dataset” button, you must select a zip file listed on the left side of the screen. Similarly to using a new dataset, you can upload a preprocessed dataset to use. This dataset must be the same format as or come from the Saved_Preprocessed folder mentioned in the previous section. When a file is selected, a dialog modal will appear in the center of the page asking if you would like to query using this dataset. It will also prompt you to review/enter the necessary parameters to create the Spark context.

Clicking “yes” on this modal will bring you straight to the “Find Similar Sequences” page. Here, you will see querying parameters available on the left side, as well as an unpopulated statistics window, empty table, and empty graph. To select a query sequence, choose the file from your local machine. The query sequence file must contain only a single row of data taken from the same dataset or a dataset with the same number of identifiers. See "Query Options" for more information. 

After entering the number of matches and overlap values, or using the defaults, clicking “Start Query” will initiate the querying process. While the matches are being found, a loading overlay will appear over the graph. On completion of the query, the table and graph will populate with all the matches. To toggle the visibility of each sequence on the graph, select/deselect the row in the table. To save the query results into a CSV file, click on the “Save Query Results” button at the bottom of the table. This will create a CSV file and store it in the “Saved_Results” folder of the project root directory.
