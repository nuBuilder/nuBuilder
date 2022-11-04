import sys
import os
import re
currentDir = os.path.join(os.path.dirname(os.path.realpath(__file__)), ".")
sys.path.append(currentDir)
nuConfigItems = {
    "nuConfigDBHost": None,
    "nuConfigDBName": None,
    "nuConfigDBUser": None,
    "nuConfigDBPassword": None
}
def getNuConfig():
    filename = "nuconfig.php"
    here = os.path.dirname(__file__)
    filenameWithPath = os.path.join(here, "..", filename)
    file = open(filenameWithPath, "r")
    for line in file:
        match = re.search('[$](nuConfigDB[^\s=]*)\s*=\s*"([^\s;]+)";', line)
        if match:
            item  = match.group(1)
            value = match.group(2)
            if item in nuConfigItems:
                nuConfigItems[item] = value  # Overwrite "None"
                # DEBUG: print(f"{item} = {value}")
    notFound = []
    for item in nuConfigItems:
        if nuConfigItems[item] == None:
            notFound.append(item)
    if len(notFound) != 0:
        notFoundTxt = f"Error: could not find required nuConfig item(s) in file ${filename}: "+", ".join(notFound)
        raise Exception(notFoundTxt)
    return nuConfigItems

def application(environ, start_response):
    nuConfigItems = getNuConfig()
    for item in nuConfigItems:
        os.environ[item] = nuConfigItems[item]
        # DEBUG: print(f"{item} = {nuConfigItems[item]}")
    from app import app as _application
    return _application(environ, start_response)

if __name__ == '__main__':
    _application.run(debug=True, threaded=True)
