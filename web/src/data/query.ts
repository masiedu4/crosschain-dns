import { gql } from "graphql-tag";
import { Hex, hexToString } from "viem";
import { graphQlServer } from "./config";
import { GameResult } from "../lib/types";

export const NOTICES_QUERY = gql`
  query notices {
    notices {
      edges {
        node {
          index
          input {
            index
            timestamp
            msgSender
            blockNumber
          }
          payload
        }
      }
    }
  }
`;

interface Notice {
  index: string;
  input: {
    index: string;
    timestamp: string;
    msgSender: string;
    blockNumber: string;
  };
  payload: Hex;
}

interface NoticesResponse {
  data: {
    notices: {
      edges: Array<{
        node: Notice;
      }>;
    };
  };
}

export async function fetchNotices(): Promise<NoticesResponse | null> {
  try {
    const response = await fetch(graphQlServer, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: NOTICES_QUERY.loc?.source.body,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: NoticesResponse = await response.json();

    return result;
  } catch (error) {
    throw error;
  }
}

export async function fetchNoticeByGameId(
  gameId: number
): Promise<GameResult | null> {
  try {
    const result = await fetchNotices();
    const notices = result?.data.notices.edges.map((edge) => edge.node);

    if (!notices) {
      return null; // If notices is undefined
    }

    for (const notice of notices) {
      try {
        const payloadJson = JSON.parse(hexToString(notice.payload));
        if (payloadJson.game_id === gameId && payloadJson.is_ended === true) {
          console.log("Parsed payload:", payloadJson);
          return payloadJson;
        }
      } catch (error) {
        throw error;
      }
    }

    return null; // If no matching notice is found
  } catch (error) {
    throw error;
  }
}

// fetch leaderboard

export async function fetchLatestLeaderboard(): Promise<any | null> {
  try {
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    const result = await fetchNotices();
    const notices = result?.data.notices.edges.map((edge) => edge.node);

    if (!notices) {
      return null;
    }

    let latestLeaderboard = null;
    let latestTimestamp = 0;

    for (const notice of notices) {
      const noticeTimestamp = parseInt(notice.input.timestamp);
      if (noticeTimestamp <= currentTime && noticeTimestamp > latestTimestamp) {
        try {
          const payloadJson = JSON.parse(hexToString(notice.payload));
          if (payloadJson.type === "leaderboard") {
            latestLeaderboard = payloadJson;
            latestTimestamp = noticeTimestamp;
          }
        } catch (error) {
          console.error("Error parsing payload:", error);
        }
      }
    }

    return latestLeaderboard;
  } catch (error) {
    throw error;
  }
}

// fetch most recent current game

export async function fetchLatestStartGame(
  msgSender: string
): Promise<any | null> {
  try {
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    const result = await fetchNotices();
    const notices = result?.data.notices.edges.map((edge) => edge.node);

    if (!notices) {
      return null;
    }

    let latestStartGame = null;
    let latestTimestamp = 0;

    for (const notice of notices) {
      const noticeTimestamp = parseInt(notice.input.timestamp);
      if (
        notice.input.msgSender === msgSender &&
        noticeTimestamp <= currentTime &&
        noticeTimestamp > latestTimestamp
      ) {
        try {
          const payloadJson = JSON.parse(hexToString(notice.payload));
          if (payloadJson.type === "start_game") {
            latestStartGame = payloadJson;
            latestTimestamp = noticeTimestamp;
          }
        } catch (error) {
          console.error("Error parsing payload:", error);
        }
      }
    }

    return latestStartGame;
  } catch (error) {
    throw error;
  }
}

// fetch game results for msg_sender

export async function fetchLatestEndGame(
  msgSender: string
): Promise<any | null> {
  try {
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    const result = await fetchNotices();
    const notices = result?.data.notices.edges.map((edge) => edge.node);

    if (!notices) {
      return null;
    }

    let latestEndGame = null;
    let latestTimestamp = 0;

    for (const notice of notices) {
      const noticeTimestamp = parseInt(notice.input.timestamp);
      if (
        notice.input.msgSender === msgSender &&
        noticeTimestamp <= currentTime &&
        noticeTimestamp > latestTimestamp
      ) {
        try {
          const payloadJson = JSON.parse(hexToString(notice.payload));
          if (payloadJson.type === "end_game") {
            latestEndGame = payloadJson;
            latestTimestamp = noticeTimestamp;
          }
        } catch (error) {
          console.error("Error parsing payload:", error);
        }
      }
    }

    return latestEndGame;
  } catch (error) {
    throw error;
  }
}

// most recent  game history for msg.sender

export async function fetchLatestGameHistory(
  msgSender: string
): Promise<any | null> {
  try {
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    const result = await fetchNotices();
    const notices = result?.data.notices.edges.map((edge) => edge.node);

    if (!notices) {
      return null;
    }

    let latestGameHistory = null;
    let latestTimestamp = 0;

    for (const notice of notices) {
      const noticeTimestamp = parseInt(notice.input.timestamp);
      if (
        notice.input.msgSender === msgSender &&
        noticeTimestamp <= currentTime &&
        noticeTimestamp > latestTimestamp
      ) {
        try {
          const payloadJson = JSON.parse(hexToString(notice.payload));
          if (payloadJson.type === "game_history") {
            latestGameHistory = payloadJson;
            latestTimestamp = noticeTimestamp;
          }
        } catch (error) {
          console.error("Error parsing payload:", error);
        }
      }
    }

    return latestGameHistory;
  } catch (error) {
    throw error;
  }
}
