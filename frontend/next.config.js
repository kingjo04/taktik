module.exports = {
  async rewrites() {
    return [
      {
        source: "/api/exam/:id",
        destination: "https://api.taktix.co.id/student/exam/:id",
      },
      {
        source: "/api/exam/:id/start",
        destination: "https://api.taktix.co.id/student/exam/:id/start",
      },
      {
        source: "/api/exam/:id/answer/insert",
        destination: "https://api.taktix.co.id/student/exam/:id/answer/insert",
      },
      {
        source: "/api/exam/:id/answer/update",
        destination: "https://api.taktix.co.id/student/exam/:id/answer/update",
      },
      {
        source: "/api/exam/:id/answer/delete",
        destination: "https://api.taktix.co.id/student/exam/:id/answer/delete",
      },
      {
        source: "/api/exam/:id/answers",
        destination: "https://api.taktix.co.id/student/exam/:id/answers",
      },
    ];
  },
};