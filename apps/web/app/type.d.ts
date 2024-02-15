type GitHubIssue = {
  number?: string;
  title: string;
  body: string;
  state?: "open" | "closed";
};

type FetchOptions = {
  method: string;
  body?: Record<string, string | number | boolean>;
  token: string;
  owner?: string;
  repo?: string;
  params?: Record<string, string | number | boolean>;
};

type GitHubResponse<T> = Promise<T>;

type User = {
  name?: string;
  email?: string;
  image?: string;
};

// Type for my custom session with token
type SessionWithToken = {
  token?: string;
  user?: User;
};

type IssueComment = {
  id: string;
  body: string;
  user: {
    login: string;
    avatar_url: string;
  };
  created_at: string;
};

type GitHubOptions = {
  token?: string;
  owner?: string;
  repo?: string;
  params?: Record<string, string | number | boolean>;
};
