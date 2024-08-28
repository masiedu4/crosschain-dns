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


export async function fetchNoticeByGameId(
  gameId: number
): Promise<GameResult | null> {
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
    const notices = result.data.notices.edges.map((edge) => edge.node);

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
