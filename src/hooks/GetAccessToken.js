import { useAuth0 } from "@auth0/auth0-react";

export const GetAccessToken = async () => {
  const { getAccessTokenSilently } = useAuth0();
  const token = await getAccessTokenSilently();
  console.log(token);
  return token;
};
