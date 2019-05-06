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

## Guidelines
The following section shows the styles that will be used on the project for both coding and organizing git

#### JavaScript: https://google.github.io/styleguide/jsguide.html#formatting
This a semi-long document and probably a good idea to read the entire thing but for this project please
follow these sections:
- 4
- 5.1
- 5.6.2
- 5.8.1
- 5.8.3.1
- 6.1
- 6.2.3
- 6.2.5
- 6.2.7

#### Git Commits: https://chris.beams.io/posts/git-commit/
We should aim for the guidelines shown in the section **The seven rules of a great Git commit message**.
This section shows both a header line and body for each commit. If your commit changes something that
requires more explanation or you are merging a branch please write a body, otherwise, just a concise 
header is fine.

#### Git Flow: https://nvie.com/posts/a-successful-git-branching-model/ 
We are using a stripped down version of this git flow. Our git will use both a protected master and
develop branch with new development taking place on branches off of the develop branch.

![git flow](https://nvie.com/img/git-model@2x.png)

#### Git Branch
- For naming the branches apply the prefix **[firstname]_**
- If using the branch for learning or testing apply the prefix **[firstname]_test_**
- Be concise with name i.e. bob_user_authentication
- Keep branches scoped to a single fix or feature so we can merge them in faster keeping everyones code up to date


