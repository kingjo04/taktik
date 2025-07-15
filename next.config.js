/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/exam-pagination",
        destination: "https://api.taktix.co.id/student/exam-pagination",
      },
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
      {
        source: "/api/exam/:id/attemption/:attid",
        destination: "https://api.taktix.co.id/student/exam/:id/attemption/:attid",
      },
      {
        source: "/api/exam/:id/check-if-ever-rate",
        destination: "https://api.taktix.co.id/student/exam/:id/check-if-ever-rate",
      },
      {
        source: "/api/exam/:id/rate",
        destination: "https://api.taktix.co.id/student/exam/:id/rate",
      },
      {
        source: "/api/provinces",
        destination: "https://api.taktix.co.id/provinces",
      },
      {
        source: "/api/profile",
        destination: "https://api.taktix.co.id/profile",
      },
      {
        source: "/api/profile/edit",
        destination: "https://api.taktix.co.id/profile/edit",
      },
      {
        source: "/api/university/:id/major",
        destination: "https://api.program.taktix.co.id/university/:id/major",
      },
      {
        source: "/api/program",
        destination: "https://api.program.taktix.co.id/program",
      },
      {
        source: "/api/program/:id",
        destination: "https://api.program.taktix.co.id/program/:id",
      },
      {
        source: "/api/program/:programId/tryout",
        destination: "https://api.program.taktix.co.id/program/:programId/tryout",
      },
      {
        source: "/api/program/:programId/tryout/:tryoutId/schedule",
        destination: "https://api.program.taktix.co.id/program/:programId/tryout/:tryoutId/schedule", // Tambahan baru
      },
      {
        source: "/api/program/historya/:id",
        destination: "https://api.program.taktix.co.id/program/historya/:id",
      },
      {
        source: "/assets/:path*",
        destination: "https://app.taktix.co.id/assets/:path*",
      },
    ];
  },
};

module.exports = nextConfig;