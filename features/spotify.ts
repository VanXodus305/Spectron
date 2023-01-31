import WOK from "wokcommands";
import fetch from "cross-fetch";

export default async (instance: WOK, client: any) => {
  client.getSpotifyTrack = async (query: String) => {
    try {
      const trackID = query.substring(
        query.indexOf("track") + 6,
        query.indexOf("track") + 28
      );
      let spotifyTrack: any = await fetch(
        `https://api.spotify.com/v1/tracks/${trackID}`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + client.spotifyToken,
          },
        }
      ).catch(() => null);
      spotifyTrack = await spotifyTrack.json().catch(() => null);
      let spotifyArtists = "";
      spotifyTrack?.artists?.forEach(
        (artist: any) => (spotifyArtists += " " + artist.name)
      );
      if (spotifyTrack?.name.toLowerCase().includes("remix")) {
        query = spotifyTrack?.name.replace("(", "").replace(")", "");
      } else {
        query = spotifyTrack?.name.replace(/\([^()]*\)/g, "") + spotifyArtists;
      }
      query = query.replace(/[^a-zA-Z0-9 ]/g, "");
      return query;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  client.getSpotifyPlaylistTracks = async (query: String) => {
    try {
      const playlistID = query.substring(
        query.indexOf("playlist") + 9,
        query.indexOf("playlist") + 31
      );

      let spotifyPlaylistTracks: any = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistID}/tracks?limit=50`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + client.spotifyToken,
          },
        }
      ).catch(() => null);
      spotifyPlaylistTracks = await spotifyPlaylistTracks
        .json()
        .catch(() => null);
      let songList = new Array();
      spotifyPlaylistTracks?.items?.forEach((item: any) => {
        let songName = "";
        let spotifyArtists = "";
        item?.track?.artists?.forEach(
          (artist: any) => (spotifyArtists += " " + artist.name)
        );
        if (item?.track?.name.toLowerCase().includes("remix")) {
          songName = item?.track?.name.replace("(", "").replace(")", "");
        } else {
          songName =
            item?.track?.name.replace(/\([^()]*\)/g, "") + spotifyArtists;
        }
        songName = songName.replace(/[^a-zA-Z0-9 ]/g, "");
        songList.push(songName);
      });
      return songList;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  client.getSpotifyPlaylist = async (query: String) => {
    try {
      const playlistID = query.substring(
        query.indexOf("playlist") + 9,
        query.indexOf("playlist") + 31
      );
      let spotifyPlaylist: any = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistID}`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + client.spotifyToken,
          },
        }
      ).catch(() => null);
      spotifyPlaylist = await spotifyPlaylist?.json().catch(() => null);
      return spotifyPlaylist;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  client.getSpotifyToken = async () => {
    try {
      let spotifyToken: any = await fetch(
        "https://accounts.spotify.com/api/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization:
              "Basic " +
              btoa(
                process.env.Spotify_Client_ID +
                  ":" +
                  process.env.Spotify_Client_Secret
              ),
          },
          body: "grant_type=client_credentials",
        }
      ).catch(() => null);
      spotifyToken = await spotifyToken.json().catch(() => null);
      client.spotifyToken = spotifyToken.access_token;
      setTimeout(async () => {
        await client.getSpotifyToken().catch(() => null);
      }, spotifyToken.expires_in * 1000);
    } catch (error) {
      console.error(error);
    }
  };

  await client.getSpotifyToken();
};
