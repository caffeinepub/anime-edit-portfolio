import Array "mo:core/Array";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Blob "mo:core/Blob";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  type VideoEntry = {
    title : Text;
    description : Text;
    category : Text;
    animeName : Text;
    asset : Storage.ExternalBlob;
    isPublished : Bool;
  };

  module VideoEntry {
    public func compareVideoEntryByAnimeName(videoEntry1 : VideoEntry, videoEntry2 : VideoEntry) : Order.Order {
      Text.compare(videoEntry1.animeName, videoEntry2.animeName);
    };

    public func compare(videoEntry1 : VideoEntry, videoEntry2 : VideoEntry) : Order.Order {
      switch (
        Text.compare(videoEntry1.title, videoEntry2.title)
      ) {
        case (#equal) {
          switch (
            Text.compare(videoEntry1.animeName, videoEntry2.animeName)
          ) {
            case (#equal) {
              Text.compare(
                videoEntry1.category,
                videoEntry2.category,
              );
            };
            case (order) { order };
          };
        };
        case (order) { order };
      };
    };
  };

  type Profile = {
    bio : Text;
    skills : [Text];
  };

  module Profile {
    public func compare(profile1 : Profile, profile2 : Profile) : Order.Order {
      Text.compare(profile1.bio, profile2.bio);
    };
  };

  public type UserProfile = {
    name : Text;
  };

  // Authorization system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Storage system
  include MixinStorage();

  let videoEntries = Map.empty<Text, VideoEntry>();
  var profile : Profile = {
    bio = "I am an anime video editor.";
    skills = [];
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // ------------------------------------------
  // User Profile Functions
  // ------------------------------------------

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(userProfile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, userProfile);
  };

  // ------------------------------------------
  // Video Entry Admin Functions (CRUD)
  // ------------------------------------------

  public shared ({ caller }) func createVideoEntry(id : Text, entry : VideoEntry) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create video entries");
    };
    videoEntries.add(id, entry);
  };

  public shared ({ caller }) func updateVideoEntry(id : Text, entry : VideoEntry) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update video entries");
    };
    if (not videoEntries.containsKey(id)) {
      Runtime.trap("Video entry not found");
    };
    videoEntries.add(id, entry);
  };

  public shared ({ caller }) func deleteVideoEntry(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete video entries");
    };
    if (not videoEntries.containsKey(id)) {
      Runtime.trap("Video entry not found");
    };
    videoEntries.remove(id);
  };

  // ------------------------------------------
  // Video Entry Public Functions
  // ------------------------------------------

  public query func getPublishedVideoEntries() : async [VideoEntry] {
    videoEntries.values().toArray().filter(func(entry) { entry.isPublished });
  };

  public query ({ caller }) func getAllVideoEntriesSortedByAnimeName() : async [VideoEntry] {
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let entries = videoEntries.values().toArray();
    let filteredEntries = if (isAdmin) {
      entries;
    } else {
      entries.filter(func(entry) { entry.isPublished });
    };
    filteredEntries.sort(VideoEntry.compareVideoEntryByAnimeName);
  };

  public query ({ caller }) func getVideoEntriesByCategory(category : Text) : async [VideoEntry] {
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    videoEntries.values().toArray().filter(func(entry) {
      entry.category == category and (isAdmin or entry.isPublished)
    });
  };

  func getVideoEntryInternal(id : Text) : VideoEntry {
    switch (videoEntries.get(id)) {
      case (?entry) { entry };
      case (null) { Runtime.trap("Video entry not found") };
    };
  };

  public query ({ caller }) func getVideoEntry(id : Text) : async VideoEntry {
    let entry = getVideoEntryInternal(id);
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    if (not entry.isPublished and not isAdmin) {
      Runtime.trap("Unauthorized: Video entry is not published");
    };
    entry;
  };

  public query ({ caller }) func searchByAnimeName(term : Text) : async [VideoEntry] {
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    videoEntries.values().toArray().filter(func(entry) {
      entry.animeName.contains(#text term) and (isAdmin or entry.isPublished)
    });
  };

  // ------------------------------------------
  // Profile/About Section Functions
  // ------------------------------------------

  public query func getProfile() : async Profile {
    profile;
  };

  public shared ({ caller }) func updateProfile(newProfile : Profile) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update profile");
    };
    profile := newProfile;
  };

  // ------------------------------------------
  // Asset Retrieval Function
  // ------------------------------------------

  public query ({ caller }) func getVideoAsset(id : Text) : async Storage.ExternalBlob {
    let entry = getVideoEntryInternal(id);
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    if (not entry.isPublished and not isAdmin) {
      Runtime.trap("Unauthorized: Video asset is not published");
    };
    entry.asset;
  };
};
