import pandas as pd
import numpy as np
import os
import re

def minute_str_to_float(time):
    minutes = int(time.split(":")[0])
    seconds = int(time.split(":")[1])
    return minutes + seconds / 60

# Same entries are of the form 60%, this function converts it to a float like 0.6
def convert_percentage(percentage):
    if percentage == "-":
        return 0
    return float(percentage.strip("%")) / 100


def load_data() -> pd.DataFrame:
    # Extract League and Season information from filename
    regex = r".+\. (.+) \- (\d{4}-\d{4}).xls$"
    frames = []
    s = 0
    for file in os.listdir("data_raw"):
        filename = os.fsdecode(file)
        m = re.match(regex, filename)
        if m is not None:
            s += 1
            # Test something different
            df = pd.read_excel(os.path.join("data_raw", filename), sheet_name="Box score", engine="openpyxl")
            # Add information contained in filename
            df.insert(0, "Season", [m.group(2)] * len(df), False)
            df.insert(0, "League", [m.group(1)] * len(df), False)
            print(f"Processed {m.group(1)} - {m.group(2)}")
            frames.append(df)
    
    df = pd.concat(frames, ignore_index=True)
    df = df.rename(columns={"Unnamed: 0": "Jersey number", "Unnamed: 1": "Player name", "Unnamed: 2": "Team name"})
    df.columns = df.columns.str.lower()
    # df.replace("-", "0", inplace=True)
    # convert minutes string to float
    df["minutes"] = df["minutes"].apply(minute_str_to_float)
    for column in df.columns.tolist():
        if "%" in column or "percentage" in column:
            df[column] = df[column].apply(convert_percentage)

    return df


def aggregate_stats(df, df_multiples):
    """
    df: pd.DataFrame is the dataframe containing the data to be aggregated
    df_multiples: pd.DataFrame is the dataframe containing the player, season pairs that appear multiple times in df
    This can happen if a player played for multiple teams in the same season or in multiple competitions.
    """
    # After aggregating a player should not appear multiple times within the same season
    # Iterate over each player, season pair
    # df.replace("-", np.nan, inplace=True)
    df.replace("-", 0, inplace=True)
    df.replace(np.nan, 0, inplace=True)
    length = len(df_multiples[["player name", "season"]].drop_duplicates())
    loop_counter = 0

    for (player_name, season) in df_multiples[["player name", "season"]].drop_duplicates().values:
        # Extract all rows for the player, season pair
        df_player = df[(df["player name"] == player_name) & (df["season"] == season)]
        # First compute minutes player played per season
        total_minutes = df_player["minutes"] * df_player["games played"]
        total_across_all = total_minutes.sum()
        weights = total_minutes / total_across_all
        df_player_new = df_player.copy()
        # Not sure if the below line of code is still necessary
        df_player_new.iloc[:, 7:] = df_player_new.iloc[:, 7:].apply(pd.to_numeric, errors='coerce')
        # Multiply each columns by the weights and sum them up. Apply the weights row-wise to indicate
        # the importance of different statistics (weighed by minutes played)
        df_player_new.iloc[:, 7:] = df_player_new.iloc[:, 7:].mul(weights, axis=0).sum(axis=0)
        # We now have the aggregated data for the player, season pair. Each row contains the same aggregated data.
        # So we need to drop duplicates.
        df_player_new = df_player_new.drop_duplicates(subset=["player name", "season"])
        # Still need adjust the games played and minutes played. Also because the league and team data are now ambiguous, 
        # we need to set them to "aggregated".
        total_games = df_player["games played"].sum()
        avg_minutes = df_player["minutes"].mul(pd.Series(df_player["games played"]), axis=0).sum() / total_games
        df_player_new["games played"] = total_games
        df_player_new["minutes"] = avg_minutes
        df_player_new["league"] = "aggregated"
        df_player_new["team name"] = "aggregated"

        # Now, df_player_new contains the aggregated data for the player, season pair (only one row).
        # Need to copy it back to the original dataframe and drop the rows that were aggregated
        df.drop(df[(df["player name"] == player_name) & (df["season"] == season)].index, inplace=True)
        # Append the aggregated data
        df = pd.concat([df, df_player_new], ignore_index=True)
        # Display progress
        if loop_counter % 50 == 0:
            print(f"Aggregated data for {loop_counter}/{length} players.")
        loop_counter += 1

    return df

def fix_effective_field_goal(df):
    # Assumes that FGA is non-zero
    # eFG percentage is computed as (FG + 0.5 * 3P) / FGA
    # First, find data where eFG is equals to zero
    print(f"Number of zeros in eFG column (before): {df.loc[df['effective field goal percentage'] == 0, 'effective field goal percentage'].sum()}")
    zero_efg_ind = df['effective field goal percentage'] == 0
    # Ensure that we don't divide by zero
    zero_efg_df = df[zero_efg_ind & (df['field goals attempted'] != 0)].copy()
    # Update orignal df with the new eFG values, but only where eFG is zero
    df.loc[zero_efg_ind, 'effective field goal percentage'] = (zero_efg_df['field goals made'] + 0.5 * zero_efg_df['3-pt field goals made']) / zero_efg_df['field goals attempted']
    # For sanity check: print out number of zeros in effecitve field goal column
    print(f"Number of zeros in eFG column (after): {df.loc[df['effective field goal percentage'] == 0, 'effective field goal percentage'].sum()}")


if __name__ == "__main__":
    # Load data from csv files
    cutoff = 230
    df = load_data()
    # Remove duplicate entries
    duplicates_indicator = df.duplicated(subset=["player name", "team name", "league", "season"], keep=False)
    print(f"Num duplicates before drop: {duplicates_indicator.sum()}")
    df= df[duplicates_indicator == False].copy()
    print(f"Sanity check for num of duplicates:  {df.duplicated(subset=['player name', 'team name', 'league', 'season'], keep=False).sum()}")
    # Aggregate data
    # Check how many players have played for multiple teams in the same season
    df_check_ind = df.duplicated(subset=["player name", "season"], keep=False)
    df_multiples = df[df_check_ind]
    print(f"Check for multiple entries (before): {df_multiples.shape[0]}")
    df = aggregate_stats(df, df_multiples)
    # Perform sanity check, i.e. check if there are still duplicates. That is, there should only exist one player, season pair
    df_check_ind = df.duplicated(subset=["player name", "season"], keep=False)
    df_mulitiples = df[df_check_ind]
    print(f"Check for multiple entries (after): {df_mulitiples.shape[0]}")
    # Drop rows of players having played less than e.g. 230 minutes, i.e. games played times seconds per game
    df.drop(df[df["games played"] * df["minutes"] < cutoff].index, inplace=True)
    # Fix effective field goal percentage
    fix_effective_field_goal(df)
    # Save the data in a new csv file
    df.to_csv("data_aggregated.csv", index=False)