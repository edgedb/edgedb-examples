module default {
	type Workout {
		required property started_at -> datetime {
			constraint exclusive;
			default := datetime_current();
		}
	}

	type Exercise {
		required property name -> str {
			constraint exclusive;
			constraint min_len_value(1);
		};
	}
};
