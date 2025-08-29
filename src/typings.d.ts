declare namespace gapi.client {
  namespace gmail {
    namespace users {
      namespace messages {
        function list(request: {
          userId: string;
          maxResults?: number;
        }): Promise<any>;
        function get(request: { userId: string; id: string }): Promise<any>;
      }
    }
  }
}
