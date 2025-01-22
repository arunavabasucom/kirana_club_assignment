import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Contest, fetchContests } from "../services/api";
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

function ContestPage() {
  const { id } = useParams<{ id: string }>();
  const [contest, setContest] = useState<Contest | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Track loading state

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
  const title: string = "Codeforces Contest Information";
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
      <Page title={title}>
        <Text variant="bodyMd" as="p">
          Contest not found or an error occurred while fetching data.
        </Text>
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
              <Text variant="bodyMd" as="p">
                <strong>ID:</strong> {contest.id}
              </Text>
              <Text variant="bodyMd" as="p">
                <strong>Name:</strong> {contest.name}
              </Text>
              <Text variant="bodyMd" as="p">
                <strong>Type:</strong> {contest.type}
              </Text>
              <Text variant="bodyMd" as="p">
                <strong>Phase:</strong>{" "}
                <Badge
                  tone={contest.phase === "FINISHED" ? "success" : "attention"}
                >
                  {contest.phase}
                </Badge>
              </Text>
              <Text variant="bodyMd" as="p">
                <strong>Start Time:</strong> {localStartTime}
              </Text>
              <Text variant="bodyMd" as="p">
                <strong>Duration:</strong>{" "}
                {(contest.durationSeconds / 3600).toFixed(2)} hours
              </Text>
            </Box>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export default ContestPage;
