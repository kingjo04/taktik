// // next.config.mjs

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   async headers() {
//     return [
//       {
//         source: "/:path*",
//         headers: [
//           {
//             key: "Access-Control-Allow-Credentials",
//             value: "true",
//           },
//           {
//             key: "Access-Control-Allow-Origin",
//             value: "https://api.program.taktix.co.id/university",
//           },
//           {
//             key: "Access-Control-Allow-Methods",
//             value: "GET,OPTIONS,POST,PUT,DELETE",
//           },
//           {
//             key: "Access-Control-Allow-Headers",
//             value:
//               "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
//           },
//         ],
//       },
//     ];
//   },
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/university",
        destination: "https://api.program.taktix.co.id/university",
      },
      {
        source: "/api/university/:id/major",
        destination: "https://api.program.taktix.co.id/university/:id/major",
      },
      {
        source: "/api/program",
        destination: "http://api.program.taktix.co.id/program/",
      },
      {
        source: "/api/program/:id",
        destination: "http://api.program.taktix.co.id/program/:id",
      },
      {
        source: "/api/program/:id/tryout",
        destination: "http://api.program.taktix.co.id/program/:id/tryout",
      },
      {
        source: "/api/program/:id/agenda",
        destination: "http://api.program.taktix.co.id/program/:id/agenda",
      },
    ];
  },
};

export default nextConfig;
