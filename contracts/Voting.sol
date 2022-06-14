pragma solidity ^0.8.0;

contract Voting {
    //users details
    struct user {
        string name;
        string email;
        uint256 index;
    }

    uint256[] private userIndex;

    mapping(uint256 => user) userList;

    function isUser(uint256 phoneNo) public returns (bool) {
        if (userIndex.length == 0) return false;
        return (userIndex[userList[phoneNo].index] == phoneNo);
    }

    function addUser(
        uint256 phoneNo,
        string memory name,
        string memory email
    ) public returns (bool exisiting) {
        if (isUser(phoneNo) == true) return false;
        userList[phoneNo] = user(name, email, 0);
        userIndex.push(phoneNo);
        userList[phoneNo].index = userIndex.length - 1;
        return true;
    }

    function getUser(uint256 phoneNo) public view returns (user memory) {
        return userList[phoneNo];
    }

    // Candidate
    struct candidate {
        uint256 candidateId;
        string name;
        string desc;
        uint256 voteCount;
        string picture;
    }

    // Polls
    struct poll {
        uint256 id;
        string name;
        uint256 creatorUserId;
        candidate[] candidateList;
        uint256 startTime;
        uint256 endTime;
        uint256 winner;
    }

    // To generate a poll id
    uint256 numberOfPolls;

    constructor() public {
        numberOfPolls = 0;
    }

    mapping(uint256 => poll) pollList;

    // Create poll function
    function addPoll(
        string memory name,
        uint256 phoneNo,
        candidate[] memory candidateList,
        uint256 startTime,
        uint256 endTime
    ) public returns (bool success) {
        pollList[numberOfPolls].id = numberOfPolls;
        pollList[numberOfPolls].name = name;
        pollList[numberOfPolls].creatorUserId = phoneNo;
        for (uint256 i = 0; i < candidateList.length; i++)
            pollList[numberOfPolls].candidateList.push(candidateList[i]);

        pollList[numberOfPolls].startTime = startTime;
        pollList[numberOfPolls].endTime = endTime;

        numberOfPolls += 1;
        return true;
    }

    // Get polls created by this user
    function getPolls(uint256 phoneNo) public returns (poll[] memory) {
        uint256 count = 0;
        for (uint256 x = 0; x < numberOfPolls; x++) {
            if (pollList[x].creatorUserId == phoneNo) count++;
        }

        poll[] memory userPollList = new poll[](count);
        uint256 temp = 0;
        for (uint256 x = 0; x < numberOfPolls; x++) {
            if (pollList[x].creatorUserId == phoneNo)
                userPollList[temp++] = pollList[x];
        }

        return userPollList;
    }

    //Joined polls
    struct pollVoted {
        uint256 pollId;
        bool voted;
    }

    mapping(uint256 => pollVoted[]) joinedPolls;

    function joinPoll(uint256 phoneNo, uint256 pollId) public returns (bool) {
        if (pollId >= numberOfPolls) {
            return false;
        }
        joinedPolls[phoneNo].push(pollVoted(pollId, false));
    }

    //to get the list of polls joined
    struct joinedList {
        poll p;
        bool voted;
    }

    function joinedPollsList(uint256 phoneNo)
        public
        returns (joinedList[] memory)
    {
        uint256 len = joinedPolls[phoneNo].length;
        joinedList[] memory pollsList = new joinedList[](len);
        for (uint256 x = 0; x < joinedPolls[phoneNo].length; x++) {
            pollsList[x].p = pollList[joinedPolls[phoneNo][x].pollId];
            pollsList[x].voted = joinedPolls[phoneNo][x].voted;
        }

        return pollsList;
    }

    function vote(
        uint256 phoneNo,
        uint256 pollId,
        uint256 candidateId
    ) public returns (bool) {
        pollList[pollId].candidateList[candidateId].voteCount += 1;

        for (uint256 x = 0; x < joinedPolls[phoneNo].length; x++) {
            if (joinedPolls[phoneNo][x].pollId == pollId) {
                joinedPolls[phoneNo][x].voted = true;
            }
        }

        return true;
    }
}
