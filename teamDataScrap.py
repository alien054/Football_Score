import http.client
import json
import csv
from datetime import datetime
import time

now = datetime.now()
current_time = now.strftime("%H_%M_%S")

teamID = 18
connection = http.client.HTTPConnection('api.football-data.org')
headers = {'X-Auth-Token': 'c8ae1071f9d04297b20b619cf86700bd'}
apiCode = ['PL', 'PD', 'FL1', 'BL1', 'SA', 'CL']


def getData(compID):
    connection.request(
        'GET', '/v4/competitions/{}/teams'.format(compID), None, headers)
    response = json.loads(connection.getresponse().read().decode())
    return response


dataList = []
for compID in apiCode:
    print(compID)
    data = getData(compID)
    teams = data['teams']

    for team in teams:
        team_data = {'id': "", 'fullName': "", 'shortName': "", 'TLA': ""}
        team_data['id'] = team['id']
        team_data['fullName'] = team['name']
        team_data['shortName'] = team['shortName']
        team_data['TLA'] = team['tla']

        # print(team_data)
        dataList.append(team_data)

    time.sleep(6.1)

# print(dataList)
# dataJSON = json.dumps(dataList)
# print(dataJSON)

with open('data.json', 'w', encoding='utf-8') as json_file:
    json.dump(dataList, json_file)
