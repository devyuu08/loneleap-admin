// admin/pages/index.js

export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/admin/login",
      permanent: false,
    },
  };
}

export default function HomeRedirect() {
  return null; // 리다이렉트만 하고 아무것도 렌더링하지 않음
}
