using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Web;

namespace WebAPI
{
	public class Support
	{

		public static string connectionString = ConfigurationManager.ConnectionStrings["AzureDB"].ConnectionString;


		//Code from https://stackoverflow.com/questions/19673502/how-to-convert-datarow-to-an-object
		//Credit to Bharat for this function
		// function that creates an object from the given data row
		/*
		* Method Name: CreateItemFromRow
		* Description: This method is used to populate a model's fields given a DataRow.
		* Parameters: 
		*	DataRow row: The row to consume data from.
		* Returns:
		*	T: The model object with all available fields populated.
		*/
		public static T CreateItemFromRow<T>(DataRow row) where T : new()
		{
			// create a new object
			T item = new T();

			// set the item
			SetItemFromRow(item, row);

			// return 
			return item;
		}

		//Credit to Bharat for this function
		/*
		* Method Name: SetItemFromRow
		* Description: This method is used to parse a datarow and populate a given object's field.
		* Parameters: 
		*	T item: The item to populate.
		*	DataRow row: The row to consume data from.
		* Returns: N/A
		*/
		public static void SetItemFromRow<T>(T item, DataRow row) where T : new()
		{
			// go through each column
			foreach (DataColumn c in row.Table.Columns)
			{
				// find the property for the column
				PropertyInfo p = item.GetType().GetProperty(c.ColumnName);

				// if exists, set the value
				if (p != null && row[c] != DBNull.Value)
				{
					if (p.PropertyType == typeof(int))
					{
						p.SetValue(item, int.Parse(row[c].ToString()), null);
					}
					else
					{
						p.SetValue(item, row[c], null);
					}

				}
			}
		}
	}
}