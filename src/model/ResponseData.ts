export interface RootObject {
  id: Number;
  currency: String;
  dates: Map<String, Hours>
}

export interface Hours {
  hours: Map<String, DataPerHour>;
}

export interface DataPerHour {
  hourNumber: Number,
  hourCount: Number
}