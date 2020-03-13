export class GymModel{
    geometry: {location:{lat:number, lng: number}};
    icon: string;
    name: string;
    opening_hours: {open_now:boolean};
    rating: number;
    types: string[];
    vicinity: string;
    distance_away: number;
    color: string;
    detail: GymDetailModel;
}

export class GymDetailModel{
    formatted_address: string;
    formatted_phone_number: string;
    reviews: Array<GymReviewsModel>;
    website: string;
}

export class GymReviewsModel{
    author_name: string;
    author_url: string;
    profile_photo_url: string;
    rating: number;
    relative_time_description: string[];
    text: string;
}