export class TrainerModel {
    fullname: string;
    address: string;
    city: string;
    country: string;
    dob: Date | string;
    email: string;
    gender: string;
    gym:string;
    distance_away?:number;
    location: { lat: number; lng: number };
    phone: string;
    picture: string;
    rating: number;
    reviewers: number;
    uid:string;
    reviews: Array<TrainerReviewerModel>
    achievements: Array<TrainerAchievementModel>
}

export class TrainerReviewerModel {
    date: Date | string;
    name: string;
    picture: string;
    rating: number;
    text: string;
}

export class TrainerAchievementModel {
    date: Date | string;
    description: string;
    title: string;
}