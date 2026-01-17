export interface Problem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  prompt: string;
  sampleInput?: string;
  sampleOutput?: string;
  timeLimitMinutes?: number;
  solution?: string;
}

export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  priority: "critical" | "high" | "medium";
  resources: string[];
  completed: boolean;
  problems?: Problem[];
}

export const defaultRoadmapSteps: RoadmapStep[] = [
  {
    id: "1",
    title: "Master Data Structures",
    description: "Learn arrays, linked lists, stacks, queues, trees, graphs, and hash tables with implementation practice.",
    duration: "2-3 weeks",
    priority: "critical",
    resources: ["LeetCode", "GeeksforGeeks", "Cracking the Coding Interview"],
    completed: false,
    problems: [
      {
        id: "1-p1",
        title: "Reverse a Linked List",
        difficulty: "Easy",
        prompt: "Given the head of a singly linked list, reverse the list and return the reversed list.",
        sampleInput: "1->2->3->4->5",
        sampleOutput: "5->4->3->2->1",
        timeLimitMinutes: 15,
        solution: "Iterative approach using prev/current pointers; O(n) time, O(1) space."
      },
      {
        id: "1-p2",
        title: "Detect Cycle in Graph",
        difficulty: "Medium",
        prompt: "Given a directed graph, detect if there is a cycle. Return true if a cycle exists.",
        timeLimitMinutes: 30,
        solution: "Use DFS with recursion stack or Kahn's algorithm (topological sort)."
      }
    ]
  },
  {
    id: "2",
    title: "Algorithm Fundamentals",
    description: "Study sorting, searching, dynamic programming, recursion, and greedy algorithms.",
    duration: "2-3 weeks",
    priority: "critical",
    resources: ["LeetCode", "HackerRank", "Algorithm Design Manual"],
    completed: false,
    problems: [
      {
        id: "2-p1",
        title: "Two Sum",
        difficulty: "Easy",
        prompt: "Given an array of integers and a target, return indices of the two numbers such that they add up to target.",
        sampleInput: "[2,7,11,15], target=9",
        sampleOutput: "[0,1]",
        timeLimitMinutes: 15,
        solution: "Use a hashmap to store complements; O(n) time."
      },
      {
        id: "2-p2",
        title: "Longest Increasing Subsequence",
        difficulty: "Medium",
        prompt: "Find the length of the longest increasing subsequence in an array.",
        timeLimitMinutes: 40,
        solution: "DP O(n^2) or patience sorting with binary search O(n log n)."
      }
    ]
  },
  {
    id: "3",
    title: "Programming Language Proficiency",
    description: "Deepen your knowledge of Python/Java/C++ including advanced concepts and best practices.",
    duration: "1-2 weeks",
    priority: "high",
    resources: ["Official Documentation", "Practice Projects"],
    completed: false,
    problems: [
      {
        id: "3-p1",
        title: "Implement a Stack Using Queues",
        difficulty: "Medium",
        prompt: "Implement a LIFO stack using only FIFO queue operations.",
        timeLimitMinutes: 25,
        solution: "Two-queue or one-queue rotation technique."
      }
    ]
  },
  {
    id: "4",
    title: "System Design Basics",
    description: "Learn about scalability, load balancing, caching, databases, and distributed systems.",
    duration: "2 weeks",
    priority: "high",
    resources: ["System Design Primer", "Grokking System Design"],
    completed: false,
    problems: [
      {
        id: "4-p1",
        title: "Design TinyURL",
        difficulty: "Hard",
        prompt: "Design a URL shortening service like TinyURL. Describe components, data models and how to scale.",
        timeLimitMinutes: 45,
        solution: "Discuss hashing, URL mapping, DB choices, caching, and replication strategies."
      }
    ]
  },
  {
    id: "5",
    title: "Problem Solving Practice",
    description: "Solve 100+ problems covering various difficulty levels and patterns.",
    duration: "3-4 weeks",
    priority: "critical",
    resources: ["LeetCode Premium", "NeetCode", "Striver's SDE Sheet"],
    completed: false,
    problems: [
      {
        id: "5-p1",
        title: "Kth Largest Element",
        difficulty: "Medium",
        prompt: "Find the kth largest element in an unsorted array.",
        timeLimitMinutes: 25,
        solution: "Use Quickselect or a min-heap of size k."
      }
    ]
  },
  {
    id: "6",
    title: "Mock Interviews",
    description: "Practice with peers or platforms to simulate real interview conditions.",
    duration: "1-2 weeks",
    priority: "medium",
    resources: ["Pramp", "InterviewBit", "Peer Practice"],
    completed: false,
    problems: [
      {
        id: "6-p1",
        title: "Mock Phone Screen - Mixed",
        difficulty: "Medium",
        prompt: "Timed mock with 2-3 mixed problems covering DS and algorithms.",
        timeLimitMinutes: 60,
        solution: "Review solutions after the timed session."
      }
    ]
  }
];

export const allProblems: Problem[] = defaultRoadmapSteps.flatMap(s => s.problems || []);
export default defaultRoadmapSteps;
