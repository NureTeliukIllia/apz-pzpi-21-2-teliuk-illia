import axios from "axios";
import {
    AlbumsList,
    CreateAlbumDto,
    CreatePictureDto,
    Pictures,
    UpdateAlbumDto,
} from "../types/types";

const url = process.env.REACT_APP_SERVER_URL
    ? process.env.REACT_APP_SERVER_URL
    : "https://localhost:7084/api/";
