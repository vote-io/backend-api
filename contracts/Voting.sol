pragma solidity ^0.8.0;

contract Voting {
    // a candidate structure that stores basic data about a
    // candidate that stands for the election

    struct candidate {
        string name;
        uint256 votes;
    }

    candidate[] public candidate_list;

    // a voter structure that will store the details about the voter
    // includes: voted bool, verified bool,
    // IMP: do we store who the person's voted ror ?
    struct voter {
        bool voted;
        bool verified;
        bool exists;
    }

    mapping(address => voter) voter_list;

    // A constructor that init. the candidates
    constructor(string[] memory c_name) {
        for (uint256 i = 0; i < c_name.length; i++) {
            candidate memory temp;
            temp.name = c_name[i];
            temp.votes = 0;
            candidate_list.push(temp);
        }
    }

    // Bunch of useful functions

    // function that gets the candidates
    function getCandidates() public view returns (candidate[] memory) {
        return candidate_list;
    }

    // function that adds voters to the voter_list
    function add_voter(address v_address) public {
        require(!voter_list[v_address].exists, "voter already exists");
        voter memory temp;
        temp.voted = false;
        temp.verified = false;
        temp.exists = true;
        voter_list[v_address] = temp;
    }

    // function that verifies the voter
    function verify_voter(address v_address) public {
        require(voter_list[v_address].exists, "voter dos not exist");
        require(!voter_list[v_address].verified, "already verified");
        require(!voter_list[v_address].voted, "already voted");
        voter_list[v_address].verified = true;
    }

    // function to vote
    function vote(uint256 c_id) public {
        require(voter_list[msg.sender].verified, "not verified");
        require(!voter_list[msg.sender].voted, "already voted");
        voter_list[msg.sender].voted = true;
        candidate_list[c_id].votes += 1;
    }

    // function to get the results
    function get_results() public view returns (string memory winner) {
        uint256 maxVotes = 0;
        uint256 index;
        for (uint256 i = 0; i < candidate_list.length; i++) {
            if (candidate_list[i].votes > maxVotes) {
                index = i;
            }
        }
        winner = candidate_list[index].name;
    }
}
