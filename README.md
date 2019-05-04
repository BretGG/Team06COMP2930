Team 06 FiveAlive
Comp 2930 project. 
Team members: Hannah Chung
              Bret Getz
              Jessica Kim
              Stella Tran
              Rose Song
              
## Setting up EcoQuest
- Clone/download the repo
- Download and install MongoDb, ensure mongo is running
- In the local repo folder run `npm install`
- Ensure npm and node are installed and have a proper path (i.e you can call them from the command line)
              
## Running EcoQuest
1. Navigate to the local repo folder in command line or terminal
2. Enter `npm run devstart` into the command line or terminal
      This will start the server using nodemon and will display debug info to the terminal
3. Using the browser of your choice, navigate to `localhost:3000`
      Note: the port may differ depending on if the environment port variable set is set

## Project Architecture
![Project Architecure](https://github.com/BretGG/Team06COMP2930/blob/master/ProjectArchitecture.png)

The current setup is to hold regular files such as the opening window and login screen
in the public/ folder and to use the game/public/ to holder the game files, this design may change
in the future. If we use Phaser to handle menus (i.e. log in), we can remove the extra game folder
and store everything in public/