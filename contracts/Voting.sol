pragma solidity ^0.8.0;

contract Voting {

    //users details
    struct user{
        string name;
        string email;
        uint index;
    }

    uint[] private userIndex;

    mapping(uint => user) userList;

    function isUser(uint phoneNo) public returns(bool) {
        if(userIndex.length == 0) 
            return false;
        return (userIndex[userList[phoneNo].index] == phoneNo);
    }

    function addUser(uint phoneNo, string memory name, string memory email) public returns (bool exisiting) {
        if(isUser(phoneNo) == true)
            return false;
        userList[phoneNo] = user(name, email, 0);
        userIndex.push(phoneNo);
        userList[phoneNo].index = userIndex.length-1;
        return true;
    }

    function getUser(uint phoneNo) view public returns(user memory) {
        return userList[phoneNo];
    }

    // Candidate 
    struct candidate{
        uint candidateId;
        string name;
        uint voteCount;
    }

    // Polls
    struct poll{
        uint id;
        string name;
        uint creatorUserId;
        candidate[] candidateList;
        uint startTime;
        uint endTime;
        uint winner;
    }

    // To generate a poll id
    uint numberOfPolls;

    constructor() public {
        numberOfPolls = 0;
    }

    mapping(uint => poll) pollList;

    // Create poll function
    function addPoll(string memory name, uint phoneNo,  candidate[] memory candidateList, uint startTime, uint  endTime) 
    public returns (bool success) {
        pollList[numberOfPolls].id = numberOfPolls;
        pollList[numberOfPolls].name = name;
        pollList[numberOfPolls].creatorUserId = phoneNo;
        for (uint i=0; i<candidateList.length; i++) 
            pollList[numberOfPolls].candidateList.push(candidateList[i]);
        
        pollList[numberOfPolls].startTime = startTime;
        pollList[numberOfPolls].endTime = endTime;

        numberOfPolls += 1;
        return true;        
    }

    // Get polls created by this user
    function getPolls(uint phoneNo) public returns (poll [] memory){
        uint count =  0;
        for(uint x=0; x<numberOfPolls; x++){
            if(pollList[x].creatorUserId == phoneNo)
                count++;
        }

        poll[] memory userPollList = new poll[](count);
        uint temp = 0;
        for(uint x=0; x<numberOfPolls; x++){
            if(pollList[x].creatorUserId == phoneNo)
                userPollList[temp++] = pollList[x];
        }

        return userPollList;
    }

    //Joined polls
    struct pollVoted{
        uint pollId;
        bool voted;
    }

    mapping(uint => pollVoted[]) joinedPolls;

    function joinPoll(uint phoneNo, uint pollId) public {
        joinedPolls[phoneNo].push(pollVoted(pollId, false));
    }

    //to get the list of polls joined
    struct joinedList{
        poll p;
        bool voted;
    }

    function joinedPollsList(uint phoneNo) public returns (joinedList [] memory ){
        uint x = joinedPolls[phoneNo].length;
        joinedList[] memory pollsList = new joinedList[](x);
        for(uint x=0; x<joinedPolls[phoneNo].length;x++){
            pollsList[x].p = pollList[joinedPolls[phoneNo][x].pollId];
            pollsList[x].voted = joinedPolls[phoneNo][x].voted;
        }

        return pollsList;
    }

    function vote(uint phoneNo, uint pollId, uint candidateId) public returns (bool ){
        pollList[pollId].candidateList[candidateId].voteCount += 1;

        for(uint x=0; x<joinedPolls[phoneNo].length;x++){
            if(joinedPolls[phoneNo][x].pollId==pollId){
                joinedPolls[phoneNo][x].voted = true;
            }
        }

        return true;
    }
}