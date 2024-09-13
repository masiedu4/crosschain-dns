import { gql } from "graphql-tag";
import { Hex, hexToString } from "viem";
import { graphQlServer } from "./config";
import { GameData, GameResult, PlayerProfile } from "../lib/types";

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
      // cache: "no-store",
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

export async function fetchLatestNormalLeaderboard(): Promise<any | null> {
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
          if (payloadJson.type === "normal_leaderboard") {
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

export async function fetchLatestStakedLeaderboard(): Promise<any | null> {
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
          if (payloadJson.type === "staked_leaderboard") {
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
): Promise<GameData | null> {
  try {
    const currentTime = Math.floor(Date.now() / 1000);
    const result = await fetchNotices();
    const notices = result?.data.notices.edges.map((edge) => edge.node);

    if (!notices || notices.length === 0) {
      return null;
    }

    let latestStartGame: GameData | null = null;
    let latestTimestamp = 0;
    const endedGameIds = new Set<number>();

    // Gather all ended game IDs
    for (const notice of notices) {
      try {
        const payloadJson = JSON.parse(hexToString(notice.payload));
        if (payloadJson.type === "end_game") {
          endedGameIds.add(payloadJson.game_id);
        }
      } catch (error) {
        // Silently skip invalid payloads
        continue;
      }
    }

    // Find the latest start_game that hasn't ended
    for (const notice of notices) {
      const noticeTimestamp = parseInt(notice.input.timestamp);

      if (noticeTimestamp <= currentTime && noticeTimestamp > latestTimestamp) {
        try {
          const payloadJson = JSON.parse(hexToString(notice.payload));

          if (
            payloadJson.type === "start_game" &&
            payloadJson.is_ended === false &&
            !endedGameIds.has(payloadJson.game_id)
          ) {
            latestStartGame = payloadJson;
            latestTimestamp = noticeTimestamp;
          }
        } catch (error) {
          // Silently skip invalid payloads
          continue;
        }
      }
    }

    return latestStartGame;
  } catch (error) {
    // Log the error and rethrow
    console.error("Error in fetchLatestStartGame:", error);
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
export async function fetchPlayerProfile(
  msgSender: string
): Promise<PlayerProfile | null> {
  try {
    const currentTime = Math.floor(Date.now() / 1000);

    const result = await fetchNotices();
    const notices = result?.data.notices.edges.map((edge) => edge.node);

    if (!notices) {
      return null;
    }

    let playerProfile: PlayerProfile | null = null;
    let latestTimestamp = 0;

    for (const notice of notices) {
      const noticeTimestamp = parseInt(notice.input.timestamp);

      if (
        notice.input.msgSender.toLowerCase() === msgSender.toLowerCase() &&
        noticeTimestamp <= currentTime &&
        noticeTimestamp > latestTimestamp
      ) {
        try {
          const decodedPayload = hexToString(notice.payload);

          const payloadJson = JSON.parse(decodedPayload);

          if (payloadJson.type === "player_profile") {
            playerProfile = payloadJson.data;
            latestTimestamp = noticeTimestamp;
          }
        } catch (error) {
          console.error("Error parsing payload:", error);
        }
      } else {
      }
    }
    console.log(playerProfile);

    return playerProfile;
  } catch (error) {
    throw error;
  }
}
