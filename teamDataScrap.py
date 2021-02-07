import http.client
import json
import csv
from datetime import datetime
import time

now = datetime.now()
current_time = now.strftime("%H_%M_%S")

teamID = 18
connection = http.client.HTTPConnection('api.football-data.org')
headers = {'X-Auth-Token': '7363f87364d44da89e034ab7bf772943'}
apiCode = ['PL', 'PD', 'FL1', 'BL1', 'SA', 'CL']


def getData(compID):
    connection.request(
        'GET', '/v2/competitions/{}/teams'.format(compID), None, headers)
    response = json.loads(connection.getresponse().read().decode())
    return response


csv_file = open('teamData' +
                current_time+'.csv', 'w', newline='', encoding="utf-8")
fieldnames = ["id", "fullName", "shortName", "TLA"]
writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
writer.writeheader()

for compID in apiCode:
    print(compID)
    data = getData(compID)
    teams = data['teams']
    team_data = {'id': "", 'fullName': "", 'shortName': "", 'TLA': ""}

    for team in teams:
        team_data['id'] = team['id']
        team_data['fullName'] = team['name']
        team_data['shortName'] = team['shortName']
        team_data['TLA'] = team['tla']

        writer.writerow(team_data)

#     time.sleep(6.1)

# data = getData('CL')
# teams = data['teams']

# for team in teams:
#     print(team['id'], team['name'], team['shortName'], team['tla'])
