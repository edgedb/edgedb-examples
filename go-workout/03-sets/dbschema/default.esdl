module default {
	type Workout {
		required property started_at -> datetime {
			constraint exclusive;
			default := datetime_current();
		}
		multi link sets -> Set_ {
			constraint exclusive;
		}
	}

	type Exercise {
		required property name -> str {
			constraint exclusive;
			constraint min_len_value(1);
		};
	}

	scalar type SetIndex extending sequence;

	type Set_ {
		required link exercise -> Exercise;
		required property index -> SetIndex {
			constraint exclusive;
			constraint min_value(0);
		};
		required property weight -> float32;
		required property reps -> int16 {
			constraint min_value(0);
		};
	}
};
