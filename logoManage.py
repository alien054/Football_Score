import os
import json
from shutil import copy2

competition_names = ['epl', 'laliga', 'ligue1', 'bundesliga', 'seria']
src = './images/New folder/'
dst = './images/team_logo/'


for cname in competition_names:
    filelist = [file for file in os.listdir(
        './images/New folder/{}'.format(cname)) if '150x150' in file]

    for file in filelist:
        for team in data:
            print(team['fullName'])
            # if team['fullName'] in file:
            #     print (team['fullName'])
        # copy2(src+cname+'/'+file, dst+file)
