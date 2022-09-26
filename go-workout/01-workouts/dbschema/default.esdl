module default {
	type Workout {
		required property started_at -> datetime {
			constraint exclusive;
			default := datetime_current();
		}
	}
};
