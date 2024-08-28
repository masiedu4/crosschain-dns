export interface InspectOutput {
	status?: string;
	exception_payload?: null | string;
	reports?: any[];
	processed_input_count?: number;
      }


      export interface GameData {
	game_id: number;
	scrambled_letters: string;
	timestamp: number;
	duration: number;
	is_ended: boolean;
	words_won: string[];
	bonus_words_won: string[];
	points_earned: number;
	bonus_points_earned: number;
      }
      
      export interface GameResult extends GameData {
	words_submitted: string[];
	original_words: string[];
	sample_possible_words: string[];
	additional_possible_words_count: number;
      }