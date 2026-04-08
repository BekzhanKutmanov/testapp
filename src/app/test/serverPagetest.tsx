// import { notFound, redirect } from 'next/navigation';
//
// import { getShowSubject } from '@/features/api/api'
// import NotFound from '@components/states/NotFound'
//
// interface PageProps {
//   params: { id: string };
// }
//
// export default async function Subject({params}: PageProps) {
//   const { id } = params;
//
//   try {
//     const subject = await getShowSubject(Number(id));
//
//     // if (!subject?.length) {
//     //   return <div className={'bg-backgroundPaper p-3 rounded shadow-md'}><NotFound /></div>
//     // }
//
//     return <div>server</div>;
//   } catch (e: any) {
//
//     if (e.status === 401) {
//       redirect('/login');
//     }
//
//     if (e.status === 403) {
//       redirect('/');
//     }
//
//     if (e.status === 404) {
//       notFound();
//     }
//
//     throw e; // остальные ошибки
//   }
//
//   return (
//     <div>
//       server
//     </div>
//   );
// }
