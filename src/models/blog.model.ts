export class BlogModel {
    type: string;
    title: string;
    content: string;
    images: Array<string>;
    likes: Array<BlogLike> | any;
    comments: Array<BlogComment>| any;
    bookmarks: Array<string> | any;
    created_at: Date;
    created_by: string;
    user: any;
};

export class BlogLike {
    uid: string;
    picture: string;
    name: string;
    date: Date;
    // $key:any;
};

export class BlogComment {
    uid: string;
    picture: string;
    name: string;
    date: Date;
    text: string;
};
