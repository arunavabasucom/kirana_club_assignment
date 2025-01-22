import  { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchContests } from "../services/api";
import {
  Badge,
  Box,
  Card,
  Layout,
  Page,
  SkeletonPage,
  SkeletonBodyText,
  Text,
} from "@shopify/polaris";
import KeyValue from "../components/KeyValue";
import { Contest } from "../types";

function ContestPage() {
  const { id } = useParams<{ id: string }>();
  const [contest, setContest] = useState<Contest | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const title: string = "Codeforces Contest Information";
  useEffect(() => {
    const loadContest = async () => {
      try {
        const contests = await fetchContests();
        const selectedContest = contests.find(
          (contest: Contest) => contest.id.toString() === id
        );

        if (!selectedContest) {
          setContest(null);
        } else {
          setContest(selectedContest);
        }
      } catch (error) {
        console.error("Error fetching contest data:", error);
        setContest(null);
      } finally {
        setLoading(false);
      }
    };
    loadContest();
  }, [id]);

  if (loading) {
    return (
      <SkeletonPage title={title} primaryAction>
        <Layout>
          <Layout.Section>
            <Card>
              <SkeletonBodyText />
            </Card>
          </Layout.Section>
        </Layout>
      </SkeletonPage>
    );
  }

  if (!contest) {
    return (
      <Page >
        <div style={{
          display:"flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height:"100vh"
        }}>
        <Text variant="bodyMd" as="p" >
          Contest not found or an error occurred while fetching data.
        </Text>
        </div>
      </Page>
    );
  }

  const localStartTime = new Date(
    contest.startTimeSeconds * 1000
  ).toLocaleString();

  return (
    <Page title={title}>
      <Layout>
        <Layout.Section>
          <Card>
            <Text as="h2" variant="headingLg" fontWeight="bold">
            {contest.name}
            </Text>
            <Box padding="400">
              <KeyValue label="ID" value={contest.id} />
              <KeyValue label="Name" value={contest.name} />
              <KeyValue label="Type" value={contest.type} />
              <KeyValue
                label="Phase"
                value={
                  <Badge
                    tone={
                      contest.phase === "FINISHED" ? "success" : "attention"
                    }
                  >
                    {contest.phase}
                  </Badge>
                }
              />
              <KeyValue label="Start Time" value={localStartTime} />
              <KeyValue
                label="Duration"
                value={`${(contest.durationSeconds / 3600).toFixed(2)} hours`}
              />
            </Box>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export default ContestPage;
