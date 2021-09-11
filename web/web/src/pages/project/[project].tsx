import { useRouter } from "next/router";

interface projectsProps {}

const Project: React.FC<projectsProps> = ({}) => {
  const router = useRouter();

  const { projectId } = router.query;
  return <div>Project {projectId}</div>;
};

export default Project;
