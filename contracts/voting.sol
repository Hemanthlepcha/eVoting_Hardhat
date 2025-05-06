// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    address public owner; // The owner of the contract

    struct Vote {
        string candidate;
        string electionId;
    }

    mapping(string => mapping(string => bool)) private hasVoted; // electionId => uid => bool

    // Vote count per candidate per election
    mapping(string => mapping(string => uint256)) private voteCount; // electionId => candidate => count

    // Store individual votes (optional)
    mapping(string => Vote) private votes; // key: UID

    event VoteCast(string indexed electionId, string indexed uid);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Only the owner can call this function to cast a vote
    function vote(string memory electionId, string memory uid, string memory candidate) public onlyOwner {
        require(!hasVoted[electionId][uid], "Already voted in this election");

        // Record the vote
        votes[uid] = Vote(candidate, electionId);
        hasVoted[electionId][uid] = true;
        voteCount[electionId][candidate] += 1;

        // Emit an event to indicate successful voting
        emit VoteCast(electionId, uid);
    }

    // Get vote count for a candidate in a given election
    function getVoteCount(string memory electionId, string memory candidate) public view returns (uint256) {
        return voteCount[electionId][candidate];
    }

    // Check if UID has voted (private function)
    function hasUserVoted(string memory electionId, string memory uid) private view returns (bool) {
        return hasVoted[electionId][uid];
    }
} 